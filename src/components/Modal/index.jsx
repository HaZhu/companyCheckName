import { Component } from "react";
import { View, Text } from "@tarojs/components";
import "./index.less";

export default class Modal extends Component {
    render() {
        const { title, subTitle, confirmText, cancelText, children, onCancel, onConfirm } = this.props;
        return (
            <View className='modal_wrapper'>
                <View className='modal_container'>
                    <View className='modal_header'>
                        <View className='modal_title'>{title}</View>
                        <View className='modal_sub_title'>{subTitle}</View>
                    </View>
                    <View className='modal_body'>{children}</View>
                    <View className='modal_footer border_1px_top'>
                        {cancelText && (
                            <View
                              className='cancel border_1px_right'
                              hoverClass='hover_light'
                              onClick={() => {
                                    onCancel && onCancel();
                                }}
                            >
                                {cancelText}
                            </View>
                        )}
                        {confirmText && (
                            <View
                              className='confirm'
                              hoverClass='hover_light'
                              onClick={() => {
                                    onConfirm && onConfirm();
                                }}
                            >
                                {confirmText}
                            </View>
                        )}
                    </View>
                </View>
                <View className='modal_mask' catchMove></View>
            </View>
        );
    }
}
