import PropTypes from 'prop-types';
import React from 'react';
import { View, Image, TouchableOpacity, Linking, Dimensions } from 'react-native';
import { observer } from 'mobx-react/native';
import { action, observable } from 'mobx';
import SafeComponent from '../shared/safe-component';
import InlineUrlPreviewConsent from '../files/inline-url-preview-consent';
import { vars } from '../../styles/styles';
import Text from '../controls/custom-text';
import icons from '../helpers/icons';
import { clientApp, util } from '../../lib/icebear';
import inlineImageCacheStore from '../files/inline-image-cache-store';

const borderWidth = 1;

const faviconStyle = {
    width: vars.iconSizeSmall,
    height: vars.iconSizeSmall,
    marginRight: vars.spacing.small.midi2x
};

const containerStyle = {
    flexDirection: 'row',
    alignItems: 'center',
    flexGrow: 1,
    flexShrink: 1
};

const textStyle = {
    flexGrow: 1,
    flexShrink: 1,
    fontSize: vars.font.size12
};

const nameTextStyle = [
    textStyle,
    {
        color: vars.textBlack54
    }
];

const titleTextStyle = [
    textStyle,
    {
        color: vars.peerioBlue
    }
];

const descriptionTextStyle = [
    textStyle,
    {
        color: vars.textBlack54
    }
];

const titleContainerStyle = {
    marginTop: vars.spacing.small.maxi2x
};

const descriptionContainerStyle = [
    containerStyle,
    {
        marginTop: vars.spacing.small.midi2x
    }
];

const imageSizeTextStyle = {
    fontSize: vars.font.size12,
    color: vars.textBlack54,
    marginTop: vars.spacing.small.midi2x,
    marginBottom: vars.spacing.medium.maxi2x
};

@observer
export default class InlineUrlContainer extends SafeComponent {
    @observable isOpen = true;
    @observable optimalContentWidth = 0;
    @observable optimalContentHeight = 0;

    @action.bound
    openUrl() {
        Linking.openURL(this.props.externalWebsite.url);
    }

    @action.bound
    toggleIsOpen() {
        this.isOpen = !this.isOpen;
    }

    get favicon() {
        const { favicon } = this.props.externalWebsite;
        return favicon && favicon.url ? (
            <Image style={faviconStyle} source={{ uri: favicon.url }} onPress={this.openUrl} />
        ) : (
            icons.darkNoPadding('language', this.openUrl, null, vars.iconSizeSmall)
        );
    }

    get name() {
        const { url, siteName } = this.props.externalWebsite;
        return (
            <View style={containerStyle}>
                <Text numberOfLines={1} ellipsizeMode="tail" style={nameTextStyle}>
                    {siteName || url}
                </Text>
            </View>
        );
    }

    get toggleArrowIcon() {
        return icons.darkNoPadding(
            this.isOpen ? 'arrow-drop-up' : 'arrow-drop-down',
            this.toggleIsOpen,
            { marginLeft: vars.spacing.small.midi2x }
        );
    }

    get title() {
        const { title } = this.props.externalWebsite;
        if (!title) return null;
        return (
            <TouchableOpacity
                pressRetentionOffset={vars.retentionOffset}
                style={titleContainerStyle}
                onPress={this.openUrl}>
                <Text numberOfLines={2} ellipsizeMode="tail" style={titleTextStyle}>
                    {title}
                </Text>
            </TouchableOpacity>
        );
    }

    get description() {
        const { description } = this.props.externalWebsite;
        if (!description) return null;
        return (
            <View style={descriptionContainerStyle}>
                <Text numberOfLines={4} ellipsizeMode="tail" style={descriptionTextStyle}>
                    {description}
                </Text>
            </View>
        );
    }

    get imageSize() {
        const { image } = this.props.externalWebsite;
        if (!image) return null;
        return (
            <Text italic style={imageSizeTextStyle}>
                {util.formatBytes(image.length)}
            </Text>
        );
    }

    get image() {
        const { image } = this.props.externalWebsite;
        if (!image) return null;
        const { url } = image;
        if (!url) return null;
        const cachedImage = inlineImageCacheStore.getImage(url);
        const { width, height } = cachedImage;
        const { optimalContentWidth, optimalContentHeight } = this;
        if (width <= 0 && height <= 0) return null;
        const dimensions = vars.optimizeImageSize(
            width,
            height,
            optimalContentWidth,
            optimalContentHeight
        );
        return <Image style={dimensions} source={{ uri: image.url, ...dimensions }} />;
    }

    onLayout = evt => {
        this.optimalContentWidth = evt.nativeEvent.layout.width - 2;
        this.optimalContentHeight = Dimensions.get('window').height;
    };

    get urlPreview() {
        const { title, description, image } = this.props.externalWebsite;
        const container = {
            marginTop: vars.spacing.small.midi2x,
            paddingVertical: vars.spacing.small.maxi + borderWidth,
            paddingHorizontal: vars.spacing.medium.mini2x,
            borderWidth,
            borderColor: vars.black12
        };
        const headerContainer = {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            height: 24
        };
        const showToggleIcon = title || description || image;
        return (
            <View style={container}>
                <View style={headerContainer}>
                    {this.favicon}
                    {this.name}
                    {showToggleIcon && this.toggleArrowIcon}
                </View>
                {this.isOpen && (
                    <View>
                        <View onLayout={this.onLayout}>
                            {this.title}
                            {this.description}
                            {this.imageSize}
                            {this.image}
                        </View>
                    </View>
                )}
            </View>
        );
    }

    get externalUrlConsent() {
        return (
            <InlineUrlPreviewConsent
                onChange={() => {
                    this.showUpdateSettingsLink = true;
                }}
            />
        );
    }

    renderThrow() {
        if (!clientApp.uiUserPrefs.externalContentConsented) return this.externalUrlConsent;
        if (!this.props.externalWebsite || !clientApp.uiUserPrefs.externalContentEnabled)
            return null;
        return this.urlPreview;
    }
}

InlineUrlContainer.propTypes = {
    externalWebsite: PropTypes.any.isRequired
};
