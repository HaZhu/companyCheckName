import { Component } from "react";
import { Text } from "@tarojs/components";
import "./index.less";

export default class CountDown extends Component {
    state = {
        time: ""
    };
    defaultPtops = {
        target: new Date().getTime()
    };
    componentDidMount() {
        this.init();
    }
    init() {
        this.timer = setTimeout(() => {
            this.countdown();
        }, 1000);
    }
    formatNum(num) {
        return num > 9 ? num : `0${num}`;
    }
    countdown() {
        let t = Math.ceil((this.props.target - new Date().getTime()) / 1000);
        let format = "00分00秒";
        if (t > 0) {
            let day = this.formatNum(parseInt(t / 86400));
            let lastTime = t % 86400;
            let hour = this.formatNum(parseInt(lastTime / 3600));
            lastTime = lastTime % 3600;
            let min = this.formatNum(parseInt(lastTime / 60));
            let sec = this.formatNum(lastTime % 60);
            if (day > 0) {
                hour = 24 + Number(hour);
                format = `${hour}时${min}分`;
            }
            if (day <= 0 && hour > 0) {
                format = `${hour}时${min}分`;
                // format = `${hour}:${min}`;
            }
            if (day <= 0 && hour <= 0) {
                format = `${min}分${sec}秒`;
            }
            this.init();
        } else {
            clearInterval(this.timer);
            this._callback();
        }
        this.setState({
            time: format
        });
    }
    _callback() {
        this.props.onEnd && this.props.onEnd();
    }
    render() {
        const { time } = this.state;
        return <Text className="countdown_wrap">{time}</Text>;
    }
}
