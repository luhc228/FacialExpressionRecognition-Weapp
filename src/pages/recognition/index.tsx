import Taro, { useState } from '@tarojs/taro';
import { View, Camera } from '@tarojs/components';
import { AtButton, AtToast } from 'taro-ui';
import { DevicePosition, PageStatus } from '../../enums';

const Recognition: Taro.FC<{}> = () => {

  const [src, changeSrc] = useState('');
  const [devicePosition, changeDevicePosition] = useState(DevicePosition.front);
  const [loading, setLoading] = useState(false);
  const [status, changeStatus] = useState(PageStatus.loading);

  const handleTakePhoto = () => {
    const cameraContext = Taro.createCameraContext()
    cameraContext.takePhoto({
      quality: 'high',
      success: (res) => {
        changeSrc(res.tempImagePath)
      }
    })
  }

  const handleChangeDevicePosition = () => {
    if (devicePosition === DevicePosition.front) {
      changeDevicePosition(DevicePosition.back)
    } else {
      changeDevicePosition(DevicePosition.front)
    }
  };

  const handleUploadFile = (filePath: string) => {
    Taro.uploadFile({
      url: 'https://example.weixin.qq.com/upload',
      filePath,
      name: 'image',
    }).then((res) => {
      const data = res.data;
      Taro.navigateTo({
        url: `recognitionResult?imageUrl=${filePath}`
      })
    })
  }

  const handleChooseIamge = () => {
    Taro.chooseImage().then((res) => {
      setLoading(true);
      const tempFilePaths = res.tempFilePaths;
      handleUploadFile(tempFilePaths[0])
    })
  }
  return (

    <View className='index'>
      <Camera
        device-position={devicePosition}
        flash='off'
        binderror='error'
        style={{ width: '90%', height: '300px', margin: '10px auto' }}
      />
      <AtButton onClick={handleChangeDevicePosition}>{devicePosition}</AtButton>
      <AtButton type='primary' onClick={handleTakePhoto}>Take Photo</AtButton>
      <AtButton type='secondary' onClick={handleChooseIamge}>Select Photo</AtButton>
      {/* <Image
        style='width: 300px;height: 100px;background: #fff;'
        src={src}
      /> */}
      <AtToast isOpened text='{text}' icon='{icon}'></AtToast>
    </View>
  )
}

export default Recognition;


