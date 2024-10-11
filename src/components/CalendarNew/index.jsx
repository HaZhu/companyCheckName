import { ScrollView, Text, View,Input, Button } from '@tarojs/components';
import { Component } from 'react';
import './index.less';

const  industryType = [
  {
    type: '科技类',
    list: [
      '网络科技',
      '电子商务',
      '信息技术',
      '游戏',
      '电子',
      '软件',
      '新材料',
      '教育科技',
    ],
  },
  {
    type: '许可类',
    list: [
      '投资管理',
      '金融',
      '资产',
      '商业保理',
      '融资租赁',
      '医疗器械',
      '人力资源',
      '食品',
      '劳务派遣',
    ],
  },
  {
    type: '服务类',
    list: [
      '广告',
      '文化传播',
      '建筑装潢',
      '设计',
      '美容美发',
      '房地产中介',
      '物业管理',
      '商务咨询',
      '企业管理',
    ],
  },
  {
    type: '其  他',
    list: [
      '贸易',
      '实业',
      '制造',
      '服饰',
      '化妆品',
      '工程',
      '农业',
      '餐饮管理',
      '物流',
    ],
  },
]
const  cityName = [
  "北京", "上海", "广州", "深圳",
  "杭州", "南京", "成都", "武汉", 
  "重庆", "天津", "西安", "青岛", 
  "大连", "厦门", "沈阳", "苏州", 
  "宁波", "长沙", "郑州", "济南", 
  "佛山", "东莞", "无锡", "福州", 
  "哈尔滨", "昆明"
]
const  companyType = [
  "有限公司", "合资公司"
]
const  sex = [
  "男", "女"
]
const  companyNameNum = [
  2, 3, 4
]
const  fiveElement = [
  "缺金", "缺木", "缺水", "缺火", "缺土",
  "金旺", "木旺", "水旺", "火旺", "土旺"
]
const BaseArr = {
  industryType : industryType,
  cityName : cityName,
  companyType : companyType,
  sex : sex,
  companyNameNum: companyNameNum,
  fiveElement : fiveElement,
}

export default class Calendar extends Component {
  constructor(props) {
    super(props);
    const { industryType,choseType } = props;
    this.state = {
      industryType,
      choseType
    };
  }

  handleSubmit = () => {
    // if(!this.state.industryType){
    //   return
    // }
    this.props.onChoose && this.props.onChoose(this.state.industryType);
  };
  handleClose = () => {
    this.props.onClose && this.props.onClose();
  };
  onChangeShowState = (e) => {
    this.setState({
      industryType: e
    })
  };


  render() {
    const { industryType,choseType } = this.state;
    return (
      <View className='wrap_page'>
          <View className="calendar_wrap">
          <View className='iconfont iconguanbi close' onClick={this.handleClose}></View>
          <ScrollView className="calendar_container" scrollY>
          <View className="menu">
              {
                choseType == 'industryType' && BaseArr[choseType].map((item, index) => {
                  return (
                    <View key={item}>
                      <View className="memu2_tit01">
                        <View className={`lable`}>{item?.type}</View>
                      </View>
                      {item?.list?.map((j, index) => {
                        return (
                          <View className={`li ${ j == industryType  && 'active'}`} onClick={() => {
                            this.onChangeShowState(j)
                          }} data-type={j}>
                            <Text>{j}</Text>
                          </View>
                        )
                      })}
                    </View>
                  )
                })
              }
              {
               choseType != 'industryType' && BaseArr[choseType].map((item, index) => {
                  return (
                    <View className={`li ${ item == industryType  && 'active'}`} onClick={() => {
                      this.onChangeShowState(item)
                    }}>
                      <Text>{item}</Text>
                    </View>
                  )
                })
              }

              <View className="memu2_tit02">
                <View className="lable">以上没有合适的，可手动输入</View>
                <Input
                  type="text"
                  className="input"
                  placeholder="请输入"
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
          {/* ${!this.state.industryType && 'disable'} */}
          <View className="calendar_bottom border_1px_top">
            <View className={`calendar_submit`} hoverClass="hover_light" onClick={this.handleSubmit}>
              确定
            </View>
          </View>
        </View>
      </View>
    );
  }
}
