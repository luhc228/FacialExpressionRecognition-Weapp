import Taro, { useRouter, useState, useEffect } from '@tarojs/taro';
import { View, Image } from '@tarojs/components';
import { AtButton } from 'taro-ui';
import { PageStatus } from '@/enums/index';
import CustomPageStatus from '@/components/CustomPageStatus';
import useInterval from '../../hooks/useInterval';
import appConfig from '../../appConfig';
import './index.scss';

const RecognitionResult: React.FC<{}> = () => {
  const [status, changeStatus] = useState(PageStatus.loading);
  const [isOpened, changeIsOpened] = useState(true);
  const [resultImageUrl, changeResultImageUrl] = useState('');
  const [isIntervalRunning, setIsIntervalRunning] = useState(true);

  const router = useRouter();
  const { params: { tempFilePath, resultImageName, imagePath, outputPath } } = router;

  const handleGetResult = () => {
    Taro.request({
      url: appConfig.baseUrl + '/photo-recognition/result/get',
      data: {
        imagename: resultImageName,
      }
    }).then((res) => {
      const response = res.data;
      const { success } = response;
      if (success) {
        const imageUrl = appConfig.baseUrl + response.data.imageUrl;

        setIsIntervalRunning(false);
        changeResultImageUrl(imageUrl);
        changeIsOpened(true);
        changeStatus(PageStatus.success);
      } else {
        changeIsOpened(true);
      }
    })
  };

  const handleRunDetector = (imagePath: string, outputPath: string) => {
    Taro.request({
      url: appConfig.baseUrl + '/photo-recognition/run/detector',
      method: 'POST',
      data: {
        imagePath: imagePath,
        outputPath: outputPath,
      }
    })
  }

  useInterval(() => {
    handleGetResult();
  }, isIntervalRunning ? 5000 : null);

  useEffect(() => {
    handleGetResult();
    handleRunDetector(imagePath, outputPath);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <View className='index'>
      <CustomPageStatus statusType={status} isOpened={isOpened} duration={status === PageStatus.loading ? 0 : undefined} />
      <Image
        className='originImage'
        src={tempFilePath}
      />
      <View style={{ marginLeft: 10 }}>The Result is：</View>
      <Image
        className='resultImage'
        src={resultImageUrl}
      />
      <View className='btnWrap'>
        <AtButton type='primary' onClick={() => { Taro.navigateBack() }}>Take A Photo Again</AtButton>
      </View>
    </View>
  )
}

export default RecognitionResult;
