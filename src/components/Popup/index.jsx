import { Component } from "react";
import { View, Text, ScrollView } from "@tarojs/components";
import "./index.less";

export default class Popup extends Component {
    handleClose = () => {
        this.props.onClose && this.props.onClose();
    };
    render() {
        const { title, content, confirmText } = this.props;
        return (
            <View className='popup_wrap'>
                <View className='popup_container'>
                    <View className='popup_main'>
                        {title && <View className='popup_header'>{title}</View>}
                        <ScrollView className='popup_content' scrollY>
                            <Text className='content'>{content}</Text>
                        </ScrollView>
                        <View className='popup_bottom'>
                            <View className='popup_btn' hoverClass='hover_light' onClick={this.handleClose}>
                                {confirmText || "确定"}
                            </View>
                        </View>
                    </View>
                </View>
                <View className='popup_mask' catchMove></View>
            </View>
        );
    }
}
