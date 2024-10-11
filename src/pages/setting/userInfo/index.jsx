import Taro from '@tarojs/taro';
import { View, Picker, Input, Text, Canvas } from '@tarojs/components';
import { useState, useRef, useEffect } from 'react';
import dayjs from 'dayjs';
import { showToast, selectorQueryClientRect, getPx, setRequestRecord } from '@/utils';
import { userSave, getUserTagGroup, getUserExt } from '@/api/user';

import './index.less';

const UserInfo = (props) => {
  const nowDate = dayjs().format('YYYY-MM-DD');
  const [userInfo, setUserInfo] = useState({
    nickName: '', // 昵称
    birthday: '', //生日
    region: '', //居住地
    regionName: '',
    sex: '', // 性别1：男 2：女
    affects: [], //情感状态 多选
    socials: [], //职业
    interests: [], //兴趣
    travels: [],
    frequency: [],
    visitReasons: [],
    eventInvitation: []
  });
  const [selector, setSelector] = useState([
    {
      id: 1,
      name: '男'
    },
    {
      id: 2,
      name: '女'
    }
  ]);
  const [eventInvitation, setEventInvitation] = useState([
    {
      tagId: '1',
      tagLabel: '是'
    },
    {
      tagId: '0',
      tagLabel: '否'
    }
  ]);
  const [nowStep, setNowStep] = useState(1);
  const [stepStatus, setStepStatus] = useState({
    stepOneIsTrue: false,
    stepTwoIsTrue: false,
    stepThreeIsTrue: false,
    lastStepIsTrue: true
  });
  const [tags, setTags] = useState({
    affects: [],
    interests: [],
    regions: [],
    socials: [],
    travels: [],
    frequency: [],
    visitReasons: []
  });
  const handleGetLottie = (id, src) => {
    Taro.nextTick(async () => {
      const res = await selectorQueryClientRect(id);
      const canvasSecond = res[0].node;
      const context = canvasSecond.getContext('2d');
      canvasSecond.width = getPx(2250);
      canvasSecond.height = getPx(1656);
      lottie.setup(canvasSecond);
      lottie.loadAnimation({
        loop: false,
        autoplay: true,
        animationData: src,
        rendererSettings: {
          context
        }
      });
    });
  };
  const handleGetUserInfo = async () => {
    const { data, code } = await getUserExt();
    if (code === 200) {
      setUserInfo({
        nickName: data.nickName,
        birthday: data.birthday, //生日
        region: data.region, //居住地
        regionName: data.regionName,
        sex: data.sex, // 性别1：男 2：女
        affects: data.affects ? data.affects.split(',') : [], //情感状态 多选
        socials: data.social ? data.social.split(',') : [], //职业
        interests: data.interests ? data.interests.split(',') : [], //兴趣
        travels: data.travelModes ? data.travelModes.split(',') : [],
        frequency: data.frequency ? data.frequency.split(',') : [],
        visitReasons: data.visitReasons ? data.visitReasons.split(',') : [],
        eventInvitation: data.eventInvitation ? String(data.eventInvitation).split(',') : []
      });
    }
  };
  const handleGetUserTagGroup = () => {
    getUserTagGroup().then((res) => {
      if (res.code === 200) {
        setTags(res.data);
      }
    });
  };
  // 多选
  const handleToggleCheck = (tag, type) => {
    let copys = userInfo[type];
    if (copys.includes(tag.tagId)) {
      const findIndex = copys.findIndex((item) => item === tag.tagId);
      copys.splice(findIndex, 1);
    } else {
      if (type == 'interests' && copys.length >= 3) {
        showToast('最多可选择3个兴趣标签');
        return;
      } else if (type == 'affects') {
        if ((tag.tagId == 2 && copys.includes('1')) || (tag.tagId == 1 && copys.includes('2'))) {
          showToast('单身和有伴侣只能选一个');
          return;
        } else {
          copys.push(tag.tagId);
        }
      } else {
        copys.push(tag.tagId);
      }
    }
    setUserInfo({
      ...userInfo
    });
  };
  // 单选
  const handleCheck = (tag, type) => {
    let copys = userInfo[type];
    copys = [tag.tagId];
    setUserInfo({
      ...userInfo,
      [type]: copys
    });
  };
  const handleSave = async () => {
    const res = await userSave({
      affects: userInfo.affects.join(','),
      eventInvitation: userInfo.eventInvitation.join(','),
      birthday: userInfo.birthday,
      frequency: userInfo.frequency.join(','),
      interests: userInfo.interests.join(','),
      nickName: userInfo.nickName,
      region: userInfo.region,
      sex: userInfo.sex,
      social: userInfo.socials.join(','),
      travelModes: userInfo.travels.join(','),
      visitReasons: userInfo.visitReasons.join(',')
    });
    if (res.code == 200) {
      // showToast('保存成功');
      Taro.navigateTo({
        url: '/pages/setting/userInfoResult/index'
      });
    }
  };
  useEffect(() => {
    handleGetUserInfo();
    handleGetUserTagGroup();
    handleGetLottie('#login_one', JSON_ONE);
    setRequestRecord();
  }, []);
  useEffect(() => {
    let step1, step2, step3, step4;
    if (!!userInfo.nickName && !!userInfo.birthday && !!userInfo.region && !!userInfo.sex && !!userInfo.affects.length) {
      step1 = true;
    } else {
      step1 = false;
    }
    if (!!userInfo.socials.length) {
      step2 = true;
    } else {
      step2 = false;
    }
    if (!!userInfo.interests.length) {
      step3 = true;
    } else {
      step3 = false;
    }
    setStepStatus({
      stepOneIsTrue: step1,
      stepTwoIsTrue: step2,
      stepThreeIsTrue: step3,
      lastStepIsTrue: true
    });
  }, [userInfo]);
  return (
    <View className='user_info_container'>
      <View className={`${nowStep === 1 ? 'show' : 'hide'}`}>
        <View className='form'>
          <View className='form_item'>
            <View className='label'>
              <View>姓名</View>
            </View>
            <Input
              type='text'
              className='ipt'
              value={userInfo.nickName}
              placeholder='请输入'
              onInput={(e) =>
                setUserInfo({
                  ...userInfo,
                  nickName: e.target.value
                })
              }
            />
          </View>
          <View className='form_item'>
            <View className='label'>
              <View>性别</View>
            </View>
            <Picker
              mode='selector'
              rangeKey='name'
              onChange={(e) => {
                setUserInfo({
                  ...userInfo,
                  sex: selector[e.detail.value].id
                });
              }}
              range={selector}
              value={userInfo.sex == 1 ? 0 : 1}
            >
              <Input className='ipt' placeholder='请选择' value={userInfo.sex == 1 ? '男' : userInfo.sex == 2 ? '女' : ''} disabled />
            </Picker>
          </View>
          <View className='form_item'>
            <View className='label'>
              <View>出生年月</View>
            </View>
            <Picker
              mode='date'
              end={nowDate}
              onChange={(e) => {
                setUserInfo({
                  ...userInfo,
                  birthday: e.detail.value
                });
              }}
            >
              <Input className='ipt' placeholder='请选择' value={userInfo.birthday} disabled />
            </Picker>
          </View>
          <View className='check_wrap_title mt24 check_wrap_title_flex'>
            <View className='iconfont icona-48pt-jinggao-miaobian'></View>
            <Text>关乎后期生日礼，请认真填写</Text>
          </View>

          {/* <View className="form_item">
            <View className="label">
              <View>情感状态</View>
            </View>
            <Picker mode="selector" rangeKey="tagLabel" range={tags.affects} value={userInfo.gender}>
              <Input className="ipt" placeholder="请选择" value={userInfo.gender} disabled />
            </Picker>
          </View> */}
          <View className='form_item'>
            <View className='label'>
              <View>居住地</View>
            </View>
            <Picker
              mode='selector'
              onChange={(e) => {
                setUserInfo({
                  ...userInfo,
                  region: tags.regions[e.detail.value].tagId,
                  regionName: tags.regions[e.detail.value].tagLabel
                });
              }}
              rangeKey='tagLabel'
              range={tags.regions}
              value={userInfo.regionName}
            >
              <Input className='ipt' placeholder='请选择' value={userInfo.regionName} disabled />
            </Picker>
          </View>
        </View>
        <View className='check_wrap_title mt24'>情感状态（多选）</View>
        <View className='check_wrap'>
          {tags.affects.map((item) => {
            return (
              <View
                style='margin-top:16px;'
                onClick={() => {
                  handleToggleCheck(item, 'affects');
                }}
                className={`check_item ${userInfo.affects && userInfo.affects.includes(item.tagId) && 'active'}`}
              >
                {item.tagLabel}
              </View>
            );
          })}
          {tags.affects.length % 3 === 2 && <View style='margin-top:16px;visibility:hidden;' className='check_item'></View>}
        </View>
      </View>
      <View className={`${nowStep === 2 ? 'show' : 'hide'}`}>
        <View className='check_wrap_title other_title'>单选</View>
        <View className='check_wrap'>
          {tags.socials.map((item) => {
            return (
              <View
                style='margin-top:16px;'
                onClick={() => {
                  handleCheck(item, 'socials');
                }}
                className={`check_item ${userInfo.socials && userInfo.socials.includes(item.tagId) && 'active'}`}
              >
                {item.tagLabel}
              </View>
            );
          })}
          {tags.socials.length % 3 === 2 && <View style='margin-top:16px;visibility:hidden;' className='check_item'></View>}
        </View>
      </View>
      <View className={`${nowStep === 3 ? 'show' : 'hide'}`}>
        <View className='check_wrap_title other_title'>可多选</View>
        <View className='check_wrap'>
          {tags.interests.map((item) => {
            return (
              <View
                style='margin-top:16px;'
                onClick={() => {
                  handleToggleCheck(item, 'interests');
                }}
                className={`check_item ${userInfo.interests && userInfo.interests.includes(item.tagId) && 'active'}`}
              >
                {item.tagLabel}
              </View>
            );
          })}
          {tags.interests.length % 3 === 2 && <View style='margin-top:16px;visibility:hidden;' className='check_item'></View>}
        </View>
      </View>
      <View className={`${nowStep === 4 ? 'show' : 'hide'}`}>
        <View className='check_wrap_title other_title'>
          <Text className='weightFont'>来群觅的出行方式</Text>
          <Text>（可多选）</Text>
        </View>
        <View className='check_wrap'>
          {tags.travels.map((item) => {
            return (
              <View
                style='margin-top:16px;'
                onClick={() => {
                  handleToggleCheck(item, 'travels');
                }}
                className={`check_item ${userInfo.travels && userInfo.travels.includes(item.tagId) && 'active'}`}
              >
                {item.tagLabel}
              </View>
            );
          })}
          {tags.travels.length % 3 === 2 && <View style='margin-top:16px;visibility:hidden;' className='check_item'></View>}
        </View>
        <View className='check_wrap_title other_title'>
          <Text className='weightFont'>来群觅的频次</Text>
        </View>
        <View className='check_wrap'>
          {tags.frequency.map((item) => {
            return (
              <View
                style='margin-top:16px;'
                onClick={() => {
                  handleCheck(item, 'frequency');
                }}
                className={`check_item ${userInfo.frequency && userInfo.frequency.includes(item.tagId) && 'active'}`}
              >
                {item.tagLabel}
              </View>
            );
          })}
          {tags.frequency.length % 3 === 2 && <View style='margin-top:16px;visibility:hidden;' className='check_item'></View>}
        </View>
        <View className='check_wrap_title other_title'>
          <Text className='weightFont'>来群觅的原因</Text>
          <Text>（可多选）</Text>
        </View>
        <View className='check_wrap'>
          {tags.visitReasons.map((item) => {
            return (
              <View
                style='margin-top:16px;'
                onClick={() => {
                  handleToggleCheck(item, 'visitReasons');
                }}
                className={`check_item ${userInfo.visitReasons && userInfo.visitReasons.includes(item.tagId) && 'active'}`}
              >
                {item.tagLabel}
              </View>
            );
          })}
          {tags.visitReasons.length % 3 === 2 && <View style='margin-top:16px;visibility:hidden;' className='check_item'></View>}
        </View>
        <View className='check_wrap_title other_title'>
          <Text className='weightFont'>是否希望群觅在有大型活动时进行邀请</Text>
        </View>
        <View className='check_wrap_new'>
          {eventInvitation.map((item) => {
            return (
              <View
                style='margin-top:16px;'
                onClick={() => {
                  handleCheck(item, 'eventInvitation');
                }}
                className={`check_item_new ${userInfo.eventInvitation && userInfo.eventInvitation.includes(item.tagId) && 'active'}`}
              >
                {item.tagLabel}
              </View>
            );
          })}
        </View>
      </View>
      <View className='footer_block'></View>
      <View className='footer_wrap'>
        <View className='flex-row group_line'>
          <View className={`line ${nowStep === 1 && 'active'}`}></View>
          <View className={`line ${nowStep === 2 && 'active'}`}></View>
          <View className={`line ${nowStep === 3 && 'active'}`}></View>
          <View className={`line ${nowStep === 4 && 'active'}`}></View>
        </View>
        <View className='button_box'>
          {nowStep === 1 && (
            <View
              className={`next_button ${!stepStatus.stepOneIsTrue && 'disabled'}`}
              onClick={() => {
                if (stepStatus.stepOneIsTrue) {
                  setNowStep(2);
                  handleGetLottie('#login_two', JSON_TWO);
                }
              }}
            >
              下一步
            </View>
          )}
          {nowStep === 2 && (
            <>
              <View
                className='pre_button'
                onClick={() => {
                  setNowStep(1);
                  handleGetLottie('#login_one', JSON_ONE);
                }}
              >
                <View className='iconfont iconzuo'></View>
              </View>
              <View
                className={`next_button ${!stepStatus.stepTwoIsTrue && 'disabled'}`}
                onClick={() => {
                  if (stepStatus.stepTwoIsTrue) {
                    setNowStep(3);
                    handleGetLottie('#login_three', JSON_THREE);
                  }
                }}
              >
                下一步
              </View>
            </>
          )}
          {nowStep === 3 && (
            <>
              <View
                className='pre_button'
                onClick={() => {
                  setNowStep(2);
                  handleGetLottie('#login_two', JSON_TWO);
                }}
              >
                <View className='iconfont iconzuo'></View>
              </View>
              <View
                className={`next_button ${!stepStatus.stepThreeIsTrue && 'disabled'}`}
                onClick={() => {
                  if (stepStatus.stepThreeIsTrue) {
                    setNowStep(4);
                    handleGetLottie('#login_four', JSON_FOUR);
                  }
                }}
              >
                下一步
              </View>
            </>
          )}
          {nowStep === 4 && (
            <>
              <View
                className='pre_button'
                onClick={() => {
                  setNowStep(3);
                  handleGetLottie('#login_three', JSON_THREE);
                }}
              >
                <View className='iconfont iconzuo'></View>
              </View>
              <View className={`next_button ${!stepStatus.lastStepIsTrue && 'disabled'}`} onClick={handleSave}>
                完成
              </View>
            </>
          )}
        </View>
      </View>
    </View>
  );
};
export default UserInfo;
