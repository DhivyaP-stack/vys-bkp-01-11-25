
import React from 'react';
import { Share, View, Button } from 'react-native';

export default ExpoShareComponent = () => {
    const onShare = async () => {
        try {
            const result = await Share.share({
                title: 'App link',
                message: 'Please install this app and stay safe , AppLink :https://play.google.com/store/apps/details?id=nic.goi.aarogyasetu&hl=en',
                url: 'https://play.google.com/store/apps/details?id=nic.goi.aarogyasetu&hl=en'
            });
            if (result.action === Share.sharedAction) {
                if (result.activityType) {
                    // shared with activity type of result.activityType
                } else {
                    // shared
                }
            } else if (result.action === Share.dismissedAction) {
                // dismissed
            }
        } catch (error) {
            alert(error.message);
        }
    };
    return (
        <View style={{ marginTop: 50 }}>
            <Button onPress={onShare} title="Share" />
        </View>
    );
};