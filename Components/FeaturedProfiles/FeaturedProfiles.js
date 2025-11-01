import React from 'react';
import { View, Text } from 'react-native';

export const FeaturedProfiles = ({ profiles }) => {
    return (
        <View>
            {profiles.map((profile) => (
                <View key={profile.id}>
                    {/* Other profile details... */}
                    
                    {/* Update height display */}
                    <Text>
                        Height: {(profile.height / 2.54).toFixed(2)} inches
                    </Text>
                    
                    {/* Other profile details... */}
                </View>
            ))}
        </View>
    );
}; 