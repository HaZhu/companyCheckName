import { ScrollView, Text, View,Input, Button } from '@tarojs/components';
import { Component } from 'react';
import './index.less';
const  industry_List = [
  "北京", "上海", "广州", "深圳",
  "杭州", "南京", "成都", "武汉", 
  "重庆", "天津", "西安", "青岛", 
  "大连", "厦门", "沈阳", "苏州", 
  "宁波", "长沙", "郑州", "济南", 
  "佛山", "东莞", "无锡", "福州", 
  "哈尔滨", "昆明"
]
export default class Calendar extends Component {
  constructor(props) {
    super(props);
    const { industryType } = props;
    this.state = {
      industryType
    };
  }

  handleSubmit = () => {
    if(!this.state.industryType){
      return
    }
    this.props.onChoose && this.props.onChoose(this.state.industryType);
  };
  handleClose = () => {
    this.props.onClose && this.props.onClose();
  };
  selectConfirm = () => {
  };
  onChangeShowState = (e) => {
    this.setState({
      industryType: e
    })
  };


  render() {
    const { industryType } = this.state;
    return (
      <View className='wrap_page'>
          <View className="calendar_wrap">
          <View className='iconfont iconguanbi close' onClick={this.handleClose}></View>
          <ScrollView className="calendar_container" scrollY>
          <View className="menu">
              {industry_List.map((item, index) => {
                return (
                        <View className={`li ${ item == industryType  && 'active'}`} onClick={() => {
                          this.onChangeShowState(item)
                        }}>
                          <Text>{item}</Text>
                        </View>
                )
              })}
              <View className="memu2_tit02">
                <View className="lable">以上没有您的城市，可手动输入</View>
                <Input
                  type="text"
                  className="input"
                  placeholder="请输入城市"
                  value={industryType}
                  onInput={(e) => {
                    this.setState({
                      industryType: e.detail.value
                    })
                  }}
                ></Input>
              </View>
            </View>
          </ScrollView>
          <View className="calendar_bottom border_1px_top">
            <View className={`calendar_submit ${!this.state.industryType && 'disable'}`} hoverClass="hover_light" onClick={this.handleSubmit}>
              确定
            </View>
          </View>
        </View>
      </View>
    );
  }
}
