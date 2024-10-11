import LoadingIcon from "@/assets/loading.gif";
import { View, Image } from "@tarojs/components";
import "./index.less";

export default function Loading() {
    return (
        <View className="loading_wrap">
            <Image className="loading_icon" src={LoadingIcon}></Image>
        </View>
    );
}
