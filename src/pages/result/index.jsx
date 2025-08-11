import { View,  Image, Textarea, Input } from '@tarojs/components';
import { useState,  useEffect } from 'react';
import Taro, { usePageScroll } from '@tarojs/taro';
import BackIcon from '@/components/BackIcon';
import { getGlobalData, setGlobalData } from '@/utils/global_data'
import { useGetBarHeight } from '@/hooks';
import IMG11 from '@/imgs/11.png';
import IMG4 from '@/imgs/4.png';
import IMG9 from '@/imgs/9.png';
import './index.less';

const Result = () => {
  const [barOpacity, setBarOpacity] = useState(0);
  const { barHeight, titleBarHeight } = useGetBarHeight();
  const [companyList , setCompanyList] = useState([])
  usePageScroll((e) => {
    const scrollTop = e.scrollTop;
    const opcityValue = scrollTop / 40 > 1 ? 1 : scrollTop / 40;
    setBarOpacity(opcityValue);
  });
  useEffect(() => {
    setCompanyList(getGlobalData('companyList'))
  },[])
  return (
    <View className='content_wraps' style={{ paddingTop: titleBarHeight + barHeight + 'px' }}>
    <BackIcon></BackIcon>
      <View className='fiexd_title' style={{ height: titleBarHeight + 'px', paddingTop: barHeight + 'px', opacity: 1 }}>
          取名结果
      </View>
      {
            companyList.map(item => {
              return <View className='content_wrap'>
                  <View className='componey_title'>{item.companyName}</View>
                  { 
                   item.companyMean &&  <View className='content'>
                      <Image className='imgs' src={IMG11}></Image>
                      <View className='content_rt'>
                         <View className='content_title'>寓意分析</View>
                         <View className='content_text'>{item.companyMean}</View>
                      </View>
                   </View>
                  }
                  
                  { 
                   item.fiveElementAnalysis && <View className='content'>
                     <Image className='imgs' src={IMG9}></Image>
                     <View className='content_rt'>
                        <View className='content_title'>五行分析</View>
                        <View className='content_text'>{item.fiveElementAnalysis}</View>
                     </View>
                  </View>
                  }
                  { 
                   item.wealthAnalysis && <View className='content'>
                     <Image className='imgs' src={IMG4}></Image>
                     <View className='content_rt'>
                        <View className='content_title'>财运分析</View>
                        <View className='content_text'>{item.wealthAnalysis}</View>
                     </View>
                  </View>
                  }
                  { 
                   item.birthdayAnalysis && <View className='content'>
                     <Image className='imgs' src={IMG11}></Image>
                     <View className='content_rt'>
                        <View className='content_title'>生辰分析</View>
                        <View className='content_text'>{item.birthdayAnalysis}</View>
                     </View>
                  </View>
                  }
                  { 
                   item.constellationAnalysis && <View className='content'>
                     <Image className='imgs' src={IMG11}></Image>
                     <View className='content_rt'>
                        <View className='content_title'>星座分析</View>
                        <View className='content_text'>{item.constellationAnalysis}</View>
                     </View>
                  </View>
                  }
              </View>
          })
          // companyList.map(item => {
          //     return <View className='content_wrap'>
          //         <View className='componey_title'>{item.name}</View>
          //         <View className='content'>
          //            <Image className='imgs' src={IMG11}></Image>
          //            <View className='content_rt'>
          //               <View className='content_title'>寓意分析</View>
          //               <View className='content_text'>{item.reason}</View>
          //            </View>
          //         </View>
          //     </View>
          // })
      } 
    </View>
  );
};
export default Result;