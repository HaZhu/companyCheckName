import { ScrollView, Text, View,Input, Button } from '@tarojs/components';
import { Component } from 'react';
import './index.less';
const  industry_List = [
  "有限公司", "合资公司"
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
