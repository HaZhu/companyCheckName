import React, { useState, useEffect } from 'react';
import Taro, { useShareTimeline,useReachBottom, useShareAppMessage, useDidShow } from '@tarojs/taro';
import { View, Text, Input, Button, Swiper, SwiperItem, Image, Canvas, Picker} from '@tarojs/components';
import {getPhone,nameDesign,namePayDesign, accountDetail, bannerList} from '@/api'
import { useGetBarHeight } from '@/hooks';
import { getGlobalData,setGlobalData } from '@/utils/global_data'
import { showToast,selectorQueryClientRect,getPx } from '@/utils';
import CalendarNew from '@/components/CalendarNew'
// import ChoseCity from '@/components/ChoseCity'
import HomePay from '@/components/HomePay'
import KeFuPng from '@/imgs/6.png'
// import ChoseQiYe from '@/components/ChoseQiYe'
import XieYi from '@/components/XieYi';
import lottie from 'lottie-miniprogram';
import JSON_ONE from '@/styles/json.json';

import './home.less'

const Home = () => {
  // const [banners,setBanners] = useState([{image: 'https://temmoku2020.oss-cn-hangzhou.aliyuncs.com/305b830983603a9aba63ebea3ab7eb150a078b26.jpeg'}])
  const [hasphone,setHasphone]= useState(null);
  const [showLoading,setShowLoading]= useState(false);
  const [payTab,setPayTab]= useState(1);
  const [namingNum,setNamingNum]= useState(0);
  const [form,setForm] =  useState({
    "cityName": "",
    "companyType": "",
    "industryType": "",
    "fiveElement": "",
    "birthDate": "",
    "birthTime": "",
    "sex": "",
    "companyNameNum": null,
    "nickName": "",
    "favoriteWord": ""
  })
  const  companyType = [
    "有限公司", "合资公司"
  ]
  const  sex = [
    "男", "女"
  ]
  const  companyNameNum = [
    2, 3, 4
  ]
  // const [cityName, setAreaName] = useState('杭州'); // 城市名称。如杭州,江苏,上海
  // const [industryType, setIndustryType] = useState('网络科技'); // 行业类型 如:网络技术,网络科技
  // const [companyType, setCompanyType] = useState('有限公司'); //公司类型 如:有限公司,合资公司
  // const [fiveElement, setFfiveElement] = useState('缺金'); // 五行。如:缺金、木
  // const [sex, setSex] = useState(1); // 性别。1-男，2-女
  // const [birthTime, setBirthTime] = useState('1998年12月1日丑时12点'); // 出生年月日。如：1998年12月1日丑时12点

  // const [companyNameNum, setCompanyNameNum] = useState(1); //公司字号数量
  // const [favoriteWord, setFavoriteWord] = useState('水'); // 喜欢的字
  // const [nickName, setNickName] = useState('王帅'); // 	姓名
  
  const [showPop,setShowPop]= useState(false);
  const [popType,setPopType] = useState('')
  const [showPay,setShowPay] = useState(false)
  const [banners,setBanners] = useState([])





  const [agree, setAgree] = useState(false);
  const [agreeAlert, setAgreeAlert] = useState(false);

  const handleGetLottie = async (id, src) => {
    const res = await selectorQueryClientRect(id);
    const canvasSecond = res[0].node;
    const context = canvasSecond.getContext('2d');
    canvasSecond.width = getPx(618);
    canvasSecond.height = getPx(618);
    lottie.setup(canvasSecond);
    lottie.loadAnimation({
      loop: true,
      autoplay: true,
      animationData: src,
      rendererSettings: {
        context
      }
    });
  };
  const getPhoneNumber = (e) => {
      const { encryptedData, code, iv } = e.detail;
      if(!code){
        showToast('手机号未授权');
        return 
      }
      Taro.login({
        success: function (res) {
          if (res.code) {
            getPhone({
               getMobileCode: code,
               miniAppLoginCode: res.code
            }).then((result) => {
              if(result.data && result.data && result.data.token){
                setGlobalData('token', result.data.token);
                setGlobalData('userName', result.data.userNick);
                setHasphone(true)
                setAgreeAlert(false)
                checkAgain()
              }
            });
          } else {
            console.log('登录失败！' + res.errMsg);
          }
        }
      });
  }
  const getNum = async () => {
    const res = await accountDetail()
    setNamingNum(res.data.namingNum)
  }
  const checkAgain = async () => {
    if(!form.cityName || !form.industryType || !form.companyType){
      showToast('城市、行业类型、公司类型三个必填')
      return
    }
    if(payTab == 1){

     const res = await  nameDesign({
        "cityName": form.cityName,
        "companyType": form.companyType,
        "industryType": form.industryType
      })
      setGlobalData('companyList',res.data);
      Taro.navigateTo({
        url: '/pages/result/index'
      })
    }else{
      const res = await accountDetail()
      if(!res.data.namingNum){
        showToast('可使用次数不足')
        setShowPay(true)
        return
      }
      namePayDesign({
        "cityName": form.cityName,
        "companyType": form.companyType,
        "industryType": form.industryType,
        "birthTime": `${form.birthDate}`,
        "companyNameNum": form.companyNameNum,
        "favoriteWord": form.favoriteWord,
        "fiveElement": form.fiveElement,
        "nickName": form.nickName,
        "sex": form.sex == '女' ? 2 : 1
      })
      setShowLoading(true)
      setTimeout(() => {
          getNum()
          setShowLoading(false)
      }, 2000);
    }
  }
  const handleChangeFormData = (value, type) => {
    const _params = { ...form };
    _params[type] = value;
    setForm(_params);
  };
  const handleClose = () => {
    setShowPop(false)
    setPopType('')
  }
  const onTimeChange = (e,type) => {
    const _params = { ...form };
    _params[type] = e.detail.value;
    setForm(_params);
  }
  const handleChoose = (str) => {
    const _params = { ...form };
    _params[popType] = str;
    setForm(_params);
    setShowPop(false)
    setPopType('')
  }
  const getBannerList = async() => {
     const res = await bannerList();
     setBanners(res.data)
  }
  useEffect(() => {
    Taro.login({
      success: function (r) {
        if (r.code) {
          Taro.request({
            url: `https://xapi.nmqm.fun/api/check-company/wx/user/login`,
            data: {
              code: r.code
            },
            header: {
              'Content-Type': 'application/json',
              locale: 'zh_CN'
            },
            mode: 'cors',
            method: 'GET'
          }).then( async (result) => {
             if(result.data.data && result.data.data.token){
              setGlobalData('token', result.data.data.token);
              setGlobalData('userName', result.data.data.userNick);
              setHasphone(true)
              getNum()
             }
          });
        } else {
          console.log('登录失败！');
        }
      }
    });
    handleGetLottie('#login_one', JSON_ONE);
    getBannerList()
  },[])
  const { barHeight, titleBarHeight } = useGetBarHeight();
  useDidShow(() => {
    if(getGlobalData('token')){
      getNum()
    }
    if(getGlobalData('tab') == 2){
      setPayTab(2)
    }
  })
  useShareTimeline(() => {
    return {
      title: '快来这里给企业起名核名',
      path: '/pages/home/index'
    };
  });
  useShareAppMessage(() => {
    return {
      title: '快来这里给企业起名核名',
      path: '/pages/home/index'
    };
  });
  return (
    <View className="home_page" >
      <View className="logos_wrap" style={{ height: titleBarHeight + 'px', paddingTop: barHeight + 'px' }}>
      </View>
      <View className="page__bd_wrap">
        <View className="page__bd">

          <Swiper
            className="swiper_box"
            indicatorColor='rgba(255,255,255,0.4)'
            indicatorActiveColor='#ffffff'
            circular
            indicatorDots
            autoplay
          >
            {banners.map((item) => {
              return (
                <SwiperItem key={item.id}>
                  <Image
                    className="banner_img"
                    mode='aspectFill'
                    src={item.picUrl}
                  ></Image>
                </SwiperItem>
              );
            })}
          </Swiper>
          <View className="page__bd_btm">
             <View className="item_box">
              <View onClick={() => {
                setPayTab(1)
                setGlobalData('tab',1)

              }}  className={`text-wrapper_1  ${payTab == 1 && 'active'}`}>
                 免费
              </View>
              <View onClick={() => {
                setPayTab(2)
                setGlobalData('tab',2)
              }} className={`text-wrapper_1  ${payTab == 2 && 'active'}`}>
                  付费
              </View>
            </View>
          
              <View className='pay_wrap'>
                <View className="inputView"  onClick={() => {
                      setPopType('cityName')
                      setShowPop(true)
                    }}>
                  <Input
                    className="input"
                    placeholder="选择城市"
                    disabled
                    value={form.cityName}
                  ></Input>
                  <View className='iconfont iconduanjiantou-xia'></View>
                </View>
                <View className="inputView"  onClick={() => {
                      setPopType('industryType')
                      setShowPop(true)
                    }}>
                  <Input
                    className="input"
                    placeholder="选择行业"
                    disabled
                    value={form.industryType}
                  ></Input>
                  <View className='iconfont iconduanjiantou-xia'></View>
                </View>

                <Picker className="pickerInputView" mode='selector' range={companyType} onChange={(e) => {
                      const _params = { ...form };
                      _params['companyType'] = companyType[e.detail.value];
                      setForm(_params);
                }}>
                  <View className="inputView">
                    <Input
                        className="input"
                        placeholder="企业类型"
                        disabled
                        value={form.companyType}
                      ></Input>
                    <View className='iconfont iconduanjiantou-xia'></View>
                   </View>
                </Picker>
                {/* <View className="inputView"  onClick={() => {
                      setPopType('companyType')
                      setShowPop(true)
                    }}>
                  <Input
                    className="input"
                    placeholder="企业类型"
                    disabled
                    value={form.companyType}
                  ></Input>
                  <View className='iconfont iconduanjiantou-xia'></View>
                </View> */}

                {  payTab == 2 && <> 
                <View className="inputView"     onClick={() => {
                      setPopType('fiveElement')
                      setShowPop(true)
                    }}>
                  <Input
                    className="input"
                    placeholder="五行"
                    disabled
                    value={form.fiveElement}
                  ></Input>
                  <View className='iconfont iconduanjiantou-xia'></View>
                </View>
                <Picker className="pickerInputView" mode='date' onChange={(e) => {onTimeChange(e,'birthDate')}}>
                    <View className="inputView">
                      <Input
                        className="input"
                        placeholder="出生年月"
                        disabled
                        value={form.birthDate}
                      ></Input>
                      <View className='iconfont iconduanjiantou-xia'></View>
                    </View>
                </Picker>
                {/* <Picker className="pickerInputView" mode='time' onChange={(e) => {onTimeChange(e,'birthTime')}}>
                    <View className="inputView">
                      <Input
                        className="input"
                        placeholder="出生时间"
                        disabled
                        value={form.birthTime}
                      ></Input>
                      <View className='iconfont iconduanjiantou-xia'></View>
                    </View>
                </Picker> */}

              <Picker className="pickerInputView" mode='selector' range={sex} onChange={(e) => {
                      const _params = { ...form };
                      _params['sex'] = sex[e.detail.value];
                      setForm(_params);
                }}>
                  <View className="inputView">
                  <Input
                      className="input"
                      placeholder="创始人性别"
                      disabled
                      value={form.sex}
                    ></Input>
                  <View className='iconfont iconduanjiantou-xia'></View>
                  </View>
                </Picker>


                {/* <View className="inputView"  onClick={() => {
                      setPopType('sex')
                      setShowPop(true)
                    }}>
                  <Input
                    className="input"
                    placeholder="创始人性别"
                    disabled
                    value={form.sex}
                  ></Input>
                  <View className='iconfont iconduanjiantou-xia'></View>
                </View> */}

                <View className="inputView">
                  <Input
                    className='input'
                    value={form.favoriteWord}
                    maxlength={1}
                    placeholder='心仪的汉字'
                    onInput={(e) => {
                      handleChangeFormData(e.detail.value, 'favoriteWord');
                    }}
                  />
                </View>


                    <Picker className='pickerInputView' mode='selector' range={companyNameNum} onChange={(e) => {
                          const _params = { ...form };
                          _params['companyNameNum'] = companyNameNum[e.detail.value];
                          setForm(_params);
                    }}>
                    <View className="inputView">
                      <Input
                          className="input"
                          placeholder="公司字号数量"
                          disabled
                          value={form.companyNameNum}
                        ></Input>
                      <View className='iconfont iconduanjiantou-xia'></View>
                      </View>
                    </Picker>
                {/* <View className="inputView" onClick={() => {
                      setPopType('companyNameNum')
                      setShowPop(true)
                    }}>
                  <Input
                    className='input'
                    value={form.companyNameNum}
                    disabled
                    placeholder='公司字号数量'
                    onInput={(e) => {
                      handleChangeFormData(e.detail.value, 'companyNameNum');
                    }}
                  />
                  <View className='iconfont iconduanjiantou-xia'></View>
                </View> */}
                <View className="inputView">
                  <Input
                    className='input'
                    value={form.nickName}
                    maxlength={4}
                    placeholder='创始人姓名'
                    onInput={(e) => {
                      handleChangeFormData(e.detail.value, 'nickName');
                    }}
                  />
                </View> </>
                }
              </View>
        {
          !hasphone && typeof hasphone == 'boolean' &&  <View className='agreement'>
          <View
            onClick={() => {
              setAgree(!agree);
            }}
            className={`iconfont agree_icon ${agree ? 'iconfill' : 'iconstroke'}`}
          ></View>
          我已阅读并同意
          <Text
            className='xieyi'
            onClick={() => {
              Taro.navigateTo({
                url: `/pages/agreement/index?type=1&title=隐私政策`
              });
            }}
          >
            《隐私政策》
          </Text>
        </View>
        }
        {
          agreeAlert && <XieYi type="2" onClose={() => {
            setAgreeAlert(false)
          }} onSure={(e) => {
            getPhoneNumber(e)
          }}></XieYi>
        }
          <View className="weui-btn-area">
            {!hasphone  && typeof hasphone == 'boolean' ? 
                agree ?  <Button className="weui-btn" type="primary" open-type='getPhoneNumber' onGetPhoneNumber={getPhoneNumber}>
                手机号快捷登录
              </Button> : <Button className="weui-btn" type="primary" onClick={() => {
                  setAgreeAlert(true)
                }}>
                手机号快捷登录
              </Button> :
            (
              <Button
                className="weui-btn"
                type="primary"
                onClick={checkAgain}
              >
                立即取名{ payTab == 1 ? '' : `（剩余${namingNum ? namingNum : 0}次）` }
              </Button>
            )}
          </View>
          </View>

        </View>
        </View>
         <View className={`covering_wrap ${showLoading && 'show'}`}>
          <Canvas className='lottie' id='login_one' type='2d' />
          <View className='wait_text'>取名已提交，15秒后去“我的”-“取名记录”查看</View>
         </View>
        {
          showPop &&  <View className='calendar_popup'>
          <CalendarNew choseType={popType} industryType={form[popType]} onClose={handleClose} onChoose={handleChoose}></CalendarNew>
        </View>
        }
     
        <Image style="width: 100vw" src="https://temmoku2020.oss-cn-hangzhou.aliyuncs.com/dd0bed08fa88eaf673942b45c4f7ee3aac0009ae.jpeg" mode="widthFix"></Image>
        <Button open-type="contact" className='kefu_wrap'>
           <Image src={KeFuPng} className='kefu_img'></Image>
        </Button>
        {
          showPay && <HomePay onClose={() => {
            setShowPay(false)
          }} onPayClose={() => {
            getNum()
            setShowPay(false)
          }}></HomePay>
        }
      </View>
  );
};
export default Home;
