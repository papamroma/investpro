import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { userId } = body;

        if (!userId) {
            return NextResponse.json(
                { error: 'userId is required' },
                { status: 400 }
            );
        }

        // Get IP address from request
        const forwarded = request.headers.get('x-forwarded-for');
        const ip = forwarded ? forwarded.split(',')[0] : request.headers.get('x-real-ip') || '0.0.0.0';

        // In development, use a default location
        const isDevelopment = process.env.NODE_ENV === 'development';

        let locationData = {
            ip_address: ip,
            country_code: 'KE',
            country_name: 'Kenya',
            city: 'Nairobi',
            latitude: -1.286389,
            longitude: 36.817223,
            verified: isDevelopment
        };

        // In production, use IP geolocation service
        if (!isDevelopment && ip !== '0.0.0.0') {
            try {
                // Example with ipapi.co (free tier: 1000 requests/day)
                const response = await fetch(`https://ipapi.co/${ip}/json/`);
                if (response.ok) {
                    const data = await response.json();
                    locationData = {
                        ip_address: ip,
                        country_code: data.country_code || 'KE',
                        country_name: data.country_name || 'Kenya',
                        city: data.city || 'Unknown',
                        latitude: data.latitude || 0,
                        longitude: data.longitude || 0,
                        verified: true
                    };
                }
            } catch (error) {
                console.error('IP geolocation error:', error);
            }
        }

        // Save location verification
        const { error: locationError } = await supabaseAdmin
            .from('location_verifications')
            .insert({
                user_id: userId,
                ...locationData
            });

        if (locationError) {
            console.error('Location save error:', locationError);
        }

        // Update user country
        await supabaseAdmin
            .from('users')
            .update({
                country: locationData.country_code,
                location_verified: true
            })
            .eq('id', userId);

        return NextResponse.json({
            success: true,
            location: {
                country: locationData.country_name,
                countryCode: locationData.country_code,
                city: locationData.city
            }
        });

    } catch (error) {
        console.error('Location verification error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
