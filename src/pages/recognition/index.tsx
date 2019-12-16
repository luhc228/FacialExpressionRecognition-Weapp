import Taro, { useState } from '@tarojs/taro';
import { View, Camera } from '@tarojs/components';
import { AtButton } from 'taro-ui';
import CustomPageStatus from '@/components/CustomPageStatus';
import { DevicePosition, PageStatus } from '@/enums/index';
import appConfig from '../../appConfig';

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
      quality: 'high',
      success: (res) => {
        changeIsOpened(true);
        changeStatus(PageStatus.success);
        NavigateToResultPage(res.tempImagePath)
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
      handleUploadFile(tempFilePaths[0])
    }).catch(() => {
      changeIsOpened(true);
      changeStatus(PageStatus.error)
    })
  }

  /**
   * 上传图片
   * @param filePath 
   */
  const handleUploadFile = (filePath: string) => {
    changeIsOpened(true);
    changeStatus(PageStatus.loading);
    Taro.uploadFile({
      url: appConfig.imageUploadUrl + '/photo-recognition/image/upload',
      filePath,
      name: 'image',
    }).then((res) => {
      const data = res.data;
      console.log(data);
      changeIsOpened(true);
      changeStatus(PageStatus.success);
      NavigateToResultPage(filePath);
    }).catch(() => {
      changeIsOpened(true);
      changeStatus(PageStatus.error)
    })
  }

  /**
   * 跳转到识别结果展示页面
   * @param filePath 
   */
  const NavigateToResultPage = (filePath: string) => {
    Taro.navigateTo({
      url: `/pages/recognitionResult/index?imageUrl=${filePath}`
    })
  };
  return (

    <View className='index'>
      <CustomPageStatus statusType={status} isOpened={isOpened} />
      <Camera
        device-position={devicePosition}
        flash='off'
        style={{ width: '90%', height: '300px', margin: '10px auto', display: 'flex', alignItems: 'center' }}
      />
      <AtButton onClick={handleChangeDevicePosition}>{devicePosition}</AtButton>
      <AtButton type='primary' onClick={handleTakePhoto}>Take Photo</AtButton>
      <AtButton type='secondary' onClick={handleChooseImage}>Select Photo</AtButton>

    </View>
  )
}

export default Recognition;
