import PropTypes from 'prop-types';
import React from 'react';
import { observer } from 'mobx-react/native';
import { View, ActivityIndicator } from 'react-native';
import SafeComponent from '../shared/safe-component';
import fileState from '../files/file-state';
import icons from '../helpers/icons';
import FileProgress from './file-progress';
import FileInlineContainer from './file-inline-container';
import FileSignatureError from './file-signature-error';

@observer
export default class FileInlineProgress extends SafeComponent {
    renderThrow() {
        const file = fileState.store.getById(this.props.file);
        if (!file) return null;
        if (file.signatureError) return <FileSignatureError />;
        return (
            <FileInlineContainer
                onLayout={this.layout}
                file={file}
                onAction={this.props.onAction}>
                <View style={{ flex: 0 }}>
                    {!file.uploading && this.props.transparentOnFinishUpload && <ActivityIndicator />}
                    {file.uploading && icons.darkNoPadding('close', () => fileState.cancelUpload(file))}
                </View>
                <FileProgress file={file} />
            </FileInlineContainer>
        );
    }
}

FileInlineProgress.propTypes = {
    file: PropTypes.any,
    transparentOnFinishUpload: PropTypes.bool,
    onAction: PropTypes.any
};
