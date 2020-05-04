import React from 'react';
import { observer } from 'mobx-react/native';
import { View, ScrollView, TouchableOpacity, Platform } from 'react-native';
import { observable, reaction, action } from 'mobx';
import Text from '../controls/custom-text';
import SafeComponent from '../shared/safe-component';
import SimpleTextBox from '../shared/simple-text-box';
import { vars } from '../../styles/styles';
import { User, contactStore, validation } from '../../lib/icebear';
import { t, tx, tu } from '../utils/translator';
import AvatarActionSheet from './avatar-action-sheet';
import AvatarCircle from '../shared/avatar-circle';
import icons from '../helpers/icons';
import uiState from '../layout/ui-state';
import testLabel from '../helpers/test-label';
import { transitionAnimation } from '../helpers/animations';
import fonts from '../../styles/fonts';

const emailFormatValidator = validation.validators.emailFormat.action;

const textinputContainer = {
    backgroundColor: vars.white,
    marginBottom: vars.spacing.small.mini,
    flexDirection: 'row',
    alignItems: 'center',
    overflow: 'hidden'
};

const textinput = {
    fontSize: vars.font.size14,
    height: vars.inputHeight,
    color: vars.txtDark,
    marginLeft: vars.inputPaddingLeft,
    flex: 1,
    flexGrow: 1,
    fontFamily: fonts.peerioFontFamily
};

const textStatic = {
    fontSize: vars.font.size14,
    color: vars.txtDark,
    marginLeft: vars.inputPaddingLeft,
    flex: 1,
    flexGrow: 1,
    alignSelf: 'center'
};

const flexRow = {
    flexDirection: 'row',
    flex: 0,
    flexGrow: 1,
    alignItems: 'center'
};

const label = {
    color: vars.txtDate,
    marginVertical: vars.spacing.small.mini2x,
    marginLeft: vars.spacing.small.maxi
};

const emailIcon = (
    <View style={{ marginHorizontal: vars.spacing.small.midi2x }}>{icons.plaindark('email')}</View>
);

@observer
export default class ProfileEdit extends SafeComponent {
    @observable firstName;
    @observable lastName;
    @observable newEmailText = null;
    @observable newEmailTextValid = null;
    @observable showValidationError = false;
    @observable showAddEmail = false;

    componentDidMount() {
        const { firstName, lastName } = User.current;
        Object.assign(this, { firstName, lastName });
        uiState.currentScrollView = this._scrollView;
        reaction(
            () => this.newEmailText,
            async text => {
                this.showValidationError = false;
                this.newEmailTextValid = await emailFormatValidator(text);
            }
        );
        this.addressReaction = reaction(
            () => User.current && User.current.addresses && User.current.addresses.length,
            transitionAnimation
        );
    }

    componentWillUnmount() {
        uiState.currentScrollView = null;
        uiState.currentScrollViewPosition = 0;
        this.addressReaction && this.addressReaction();
    }

    onScroll = ({
        nativeEvent: {
            contentOffset: { y }
        }
    }) => {
        uiState.currentScrollViewPosition = y;
    };

    submit = () => {
        const user = User.current;
        const { firstName, lastName } = user;
        // do not save if no changes have been made
        if (firstName === this.firstName && lastName === this.lastName) return;
        user.firstName = this.firstName;
        user.lastName = this.lastName;
        User.current.saveProfile().catch(() => {
            Object.assign(user, { firstName, lastName });
        });
    };

    saveNewEmail = () => {
        if (this.newEmailText && this.newEmailTextValid) User.current.addEmail(this.newEmailText);
        this.cancelNewEmail();
    };

    cancelNewEmail = () => {
        this.newEmailText = '';
        this.showAddEmail = false;
    };

    validateNewEmail() {
        if (this.newEmailText && !this.newEmailTextValid) {
            this.showValidationError = true;
            return false;
        }
        return true;
    }

    async emailAction() {
        if (!this.validateNewEmail()) return;
        await uiState.hideAll();
        transitionAnimation();
        this.showAddEmail = !this.showAddEmail;
        if (this.showAddEmail) {
            this._addEmailBox.focus();
        }
        if (!this.newEmailText) {
            return;
        }
        this.saveNewEmail();
    }

    get emailButton() {
        let text = 'button_addEmail';
        if (this.showAddEmail) {
            text = this.newEmailText ? 'button_save' : 'button_cancel';
        }
        return this.renderButton1(text, () => this.emailAction());
    }

    get validationError() {
        if (!this.showValidationError) return null;
        return (
            <Text
                numberOfLines={1}
                ellipsizeMode="tail"
                style={[textStatic, { color: vars.txtAlert }]}>
                {tx('error_invalidEmail')}
            </Text>
        );
    }

    renderButton1(text, onPress, disabled) {
        return (
            <TouchableOpacity
                onPress={disabled ? null : onPress}
                pressRetentionOffset={vars.retentionOffset}
                style={{
                    paddingRight: vars.spacing.small.maxi2x,
                    paddingVertical: vars.spacing.small.maxi
                }}>
                <Text bold style={{ color: disabled ? vars.txtMedium : vars.peerioBlue }}>
                    {tu(text)}
                </Text>
            </TouchableOpacity>
        );
    }

    renderText(text, style) {
        return (
            <View style={{ flexDirection: 'row', flex: 1, flexGrow: 1 }}>
                <Text numberOfLines={1} ellipsizeMode="tail" style={[textStatic, style]}>
                    {text}
                </Text>
            </View>
        );
    }

    renderUserEmail = item => {
        const canDelete = User.current.addresses.length > 1;
        const { address, confirmed, primary } = item;
        const confirmLink = this.renderButton1('button_confirm', () =>
            User.current.resendEmailConfirmation(address)
        );
        const primaryLink = this.renderButton1('button_makePrimary', () =>
            User.current.makeEmailPrimary(address)
        );
        const deleteIcon = (
            <View>{icons.dark('delete', () => User.current.removeEmail(address))}</View>
        );
        return (
            <View style={textinputContainer} key={address}>
                {emailIcon}
                <View
                    style={{
                        height: vars.inputHeight,
                        flex: 1,
                        flexGrow: 1,
                        paddingTop: vars.spacing.small.mini2x
                    }}>
                    {this.renderText(address)}
                    {confirmed && primary
                        ? this.renderText(tx('title_primaryEmail'), {
                              color: vars.peerioBlue,
                              marginTop: -8
                          })
                        : null}
                    {!confirmed
                        ? this.renderText(tx('error_unconfirmedEmail'), {
                              color: vars.txtAlert,
                              marginTop: -8
                          })
                        : null}
                </View>
                {confirmed && !primary ? primaryLink : null}
                {confirmed ? null : confirmLink}
                {!primary && canDelete ? deleteIcon : null}
            </View>
        );
    };

    selectAvatar() {
        AvatarActionSheet.show(({ buffers }) => User.current.saveAvatar(buffers));
    }

    @action.bound
    onChangeAddEmailText(text) {
        const { Version, OS } = Platform;
        if (OS !== 'android' || Version > 22) {
            this.newEmailText = text.toLowerCase();
        } else {
            this.newEmailText = text;
        }
    }

    renderThrow() {
        const contact = contactStore.getContact(User.current.username);
        const { firstName, lastName, fingerprintSkylarFormatted, username } = contact;
        const user = User.current;
        return (
            <ScrollView
                onScroll={this.onScroll}
                keyboardShouldPersistTaps="handled"
                style={{ backgroundColor: vars.darkBlueBackground05 }}
                ref={ref => {
                    this._scrollView = ref;
                }}>
                <View
                    style={[
                        flexRow,
                        {
                            backgroundColor: vars.darkBlueBackground05,
                            marginLeft: vars.spacing.medium.mini2x
                        }
                    ]}>
                    <AvatarCircle medium contact={contact} onPress={this.selectAvatar} />
                    <View
                        style={{
                            flexGrow: 1,
                            flexShrink: 1,
                            marginLeft: vars.spacing.medium.mini2x
                        }}>
                        <Text
                            {...testLabel('fullName')}
                            style={{
                                color: vars.textBlack87,
                                fontSize: vars.font.size16,
                                marginVertical: vars.spacing.small.mini2x
                            }}>
                            {firstName} {lastName}
                        </Text>
                        <Text style={{ color: vars.textBlack54 }}>@{username}</Text>
                        <View
                            style={{
                                position: 'absolute',
                                right: 0,
                                bottom: 0,
                                flexDirection: 'row'
                            }}>
                            {contact.hasAvatar && icons.dark('delete', () => user.deleteAvatar())}
                            {icons.dark(
                                'camera-alt',
                                this.selectAvatar,
                                null,
                                null,
                                'uploadAvatarIcon'
                            )}
                        </View>
                    </View>
                </View>
                <View style={{ margin: vars.spacing.small.midi2x }}>
                    <Text style={label}>{tx('title_name')}</Text>
                    <View style={textinputContainer}>
                        <SimpleTextBox
                            {...testLabel('inputFirstName')}
                            onBlur={this.submit}
                            onChangeText={text => {
                                this.firstName = text;
                            }}
                            placeholder={tx('title_firstName')}
                            style={textinput}
                            value={this.firstName}
                        />
                    </View>
                    <View style={textinputContainer}>
                        <SimpleTextBox
                            {...testLabel('inputLastName')}
                            onBlur={this.submit}
                            onChangeText={text => {
                                this.lastName = text;
                            }}
                            placeholder={tx('title_lastName')}
                            style={textinput}
                            value={this.lastName}
                        />
                    </View>
                </View>
                <View style={{ margin: vars.spacing.small.midi2x }}>
                    <Text style={label}>{tx('title_email')}</Text>
                    {user.addresses.map(this.renderUserEmail)}
                    <View style={[textinputContainer, this.showAddEmail ? null : { height: 0 }]}>
                        {emailIcon}
                        <SimpleTextBox
                            key={user.addresses.length}
                            ref={ref => {
                                this._addEmailBox = ref;
                            }}
                            placeholder={tx('title_email')}
                            keyboardType="email-address"
                            autoCorrect={false}
                            autoComplete={false}
                            autoCapitalize="none"
                            value={this.newEmailText}
                            onBlur={() => this.validateNewEmail()}
                            onChangeText={this.onChangeAddEmailText}
                            onSubmitEditing={() => this.emailAction()}
                            style={textinput}
                        />
                    </View>
                    <View style={{ marginLeft: vars.spacing.small.midi2x, flexDirection: 'row' }}>
                        {this.emailButton}
                        {this.validationError}
                    </View>
                </View>
                <View
                    style={{
                        margin: vars.spacing.medium.midi,
                        marginTop: vars.spacing.small.midi2x
                    }}>
                    <Text style={{ color: vars.txtDate, marginBottom: vars.spacing.small.midi }}>
                        {t('title_publicKey')}
                    </Text>
                    <Text
                        style={{
                            color: vars.txtMedium,
                            fontFamily: `Verdana`,
                            fontSize: vars.font.size16
                        }}
                        numberOfLines={2}>
                        {fingerprintSkylarFormatted}
                    </Text>
                </View>
            </ScrollView>
        );
    }
}
