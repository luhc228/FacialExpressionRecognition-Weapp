import Taro, { useState } from '@tarojs/taro';
import { View, Camera, Image } from '@tarojs/components';
import CustomPageStatus from '@/components/CustomPageStatus';
import { DevicePosition, PageStatus } from '@/enums/index';
import appConfig from '../../appConfig';
import './index.scss';

const recognitionImageUploadUrl = appConfig.imageUploadUrl + '/photo-recognition/image/upload';

const Recognition: Taro.FC<{}> = () => {

  const [isOpened, changeIsOpened] = useState(false);
  const [devicePosition, changeDevicePosition] = useState(DevicePosition.front);
  const [status, changeStatus] = useState(PageStatus.loading);

  /**
   * 拍照
   */
  const handleTakePhoto = () => {
    const cameraContext = Taro.createCameraContext()
    cameraContext.takePhoto({
      quality: 'low',
      success: (res) => {
        handleUploadFile(res.tempImagePath);
      },
    })
  }

  /**
   * 改变相机的摄像头的 前置或后置，值为front, back
   */
  const handleChangeDevicePosition = () => {
    if (devicePosition === DevicePosition.front) {
      changeDevicePosition(DevicePosition.back)
    } else {
      changeDevicePosition(DevicePosition.front)
    }
  };

  /**
 * 选择图片
 */
  const handleChooseImage = () => {
    Taro.chooseImage().then((res) => {
      changeIsOpened(true);
      changeStatus(PageStatus.loading);
      const tempFilePaths = res.tempFilePaths;
      handleUploadFile(tempFilePaths[0]);
    }).catch(() => {
      changeIsOpened(true);
      changeStatus(PageStatus.error)
    })
  }

  /**
   * 上传图片
   * @param filePath 
   */
  const handleUploadFile = (tempFilePath: string) => {
    changeIsOpened(true);
    changeStatus(PageStatus.loading);
    Taro.uploadFile({
      url: recognitionImageUploadUrl,
      filePath: tempFilePath,
      name: 'image',
    }).then((res) => {
      const response: { data: { [k: string]: string } } = JSON.parse(res.data);

      changeIsOpened(true);
      changeStatus(PageStatus.success);

      const { resultImageName, imagePath, outputPath } = response.data;

      NavigateToResultPage(tempFilePath, resultImageName, imagePath, outputPath);
    }).catch(() => {
      changeIsOpened(true);
      changeStatus(PageStatus.error)
    })
  }

  /**
   * 跳转到识别结果展示页面
   * @param filePath 
   */
  const NavigateToResultPage = (tempFilePath: string, resultImageName: string, imagePath: string, outputPath: string) => {
    Taro.navigateTo({
      url: `/pages/recognitionResult/index?tempFilePath=${tempFilePath}&resultImageName=${resultImageName}&imagePath=${imagePath}&outputPath=${outputPath}`
    })
  };
  return (

    <View className='index'>
      <CustomPageStatus statusType={status} isOpened={isOpened} duration={status === PageStatus.loading ? 0 : undefined} />
      <View style={{ zIndex: 1 }}>
        <Camera
          device-position={devicePosition}
          flash='off'
          className='camera'
        />
      </View>
      <View className='btnsWrap'>
        <Image src={require('../../asserts/gallery.png')} style={{ width: '32px', height: '32px' }} onClick={handleChooseImage} />
        <Image src={require('../../asserts/circle.png')} style={{ width: '75px', height: '75px' }} onClick={handleTakePhoto} />
        <Image src={require('../../asserts/camera-reverse.png')} style={{ width: '40px', height: '40px' }} onClick={handleChangeDevicePosition} />
      </View>
    </View>
  )
}

export default Recognition;
