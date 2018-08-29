import React from 'react';
import { observer } from 'mobx-react/native';
import { View } from 'react-native';
import { vars } from '../../styles/styles';
import { tx } from '../utils/translator';
import SafeComponent from '../shared/safe-component';
import signupState from './signup-state';
import Text from '../controls/custom-text';
import buttons from '../helpers/buttons';

const roundedBoxStyle = {
    borderColor: vars.txtMedium,
    borderWidth: 1,
    borderRadius: 12
};

const footer = {
    flexGrow: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: 6
};

const filenameStyle = {
    fontSize: vars.font.size.smallerx,
    color: vars.txtDark,
    backgroundColor: 'transparent'
};

const FILE_SIZE = '843KB';

const filesizeStyle = {
    fontSize: vars.font.size.smallerx,
    color: vars.textBlack54,
    backgroundColor: 'transparent'
};

const previewBox = {
    borderTopRightRadius: 12,
    borderTopLeftRadius: 12,
    backgroundColor: '#dce8f6',
    paddingHorizontal: 24
};

const innerPreviewBox = {
    height: 100,
    backgroundColor: '#2e2f4b',
    alignItems: 'center',
    justifyContent: 'space-between'
};

const previewHeaderText = {
    color: vars.white,
    fontSize: vars.font.size.smaller
};

const textBox = {
    backgroundColor: vars.white,
    borderRadius: 4,
    alignSelf: 'stretch',
    marginHorizontal: 16,
    alignItems: 'center',
    marginBottom: 8
};

const textBoxText = {
    color: vars.textBlack87,
    fontSize: vars.font.size.xsmall,
    marginVertical: 4
};

@observer
export default class SignupPdfPreview extends SafeComponent {
    renderThrow() {
        return (
            <View style={roundedBoxStyle}>
                <View style={previewBox}>
                    <View style={innerPreviewBox}>
                        <Text semibold style={previewHeaderText}>
                            {tx('title_demoPdfUsernameLabel')}
                        </Text>
                        <View style={textBox}>
                            <Text style={textBoxText} monospace>
                                {signupState.username}
                            </Text>
                        </View>
                        <Text semibold style={previewHeaderText}>
                            {tx('title_demoPdfAkLabel')}
                        </Text>
                        <View style={textBox}>
                            <Text style={textBoxText} monospace>
                                {signupState.passphrase}
                            </Text>
                        </View>
                    </View>
                </View>
                <View style={footer}>
                    <View>
                        <Text style={filenameStyle}>
                            {signupState.backupFileName}
                        </Text>
                        <Text style={filesizeStyle}>
                            {FILE_SIZE}
                        </Text>
                    </View>
                    {buttons.roundBlueBgButton(
                        tx('button_downloadPdf'),
                        signupState.saveAccountKey,
                        null,
                        'button_downloadPdf',
                        { marginHorizontal: vars.spacing.small.mini2x })}
                </View>
            </View>
        );
    }
}
