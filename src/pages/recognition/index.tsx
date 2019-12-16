import Taro, { useState } from '@tarojs/taro';
import { View, Camera } from '@tarojs/components';
import { AtButton } from 'taro-ui';
import CustomPageStatus from '@/components/CustomPageStatus';
import { DevicePosition, PageStatus } from '@/enums/index';

const Recognition: Taro.FC<{}> = () => {

  // const [src, changeSrc] = useState('');
  const [devicePosition, changeDevicePosition] = useState(DevicePosition.front);
  const [status, changeStatus] = useState(PageStatus.loading);

  const handleTakePhoto = () => {
    const cameraContext = Taro.createCameraContext()
    cameraContext.takePhoto({
      quality: 'high',
      success: (res) => {
        changeStatus(PageStatus.success);
        NavigateToResultPage(res.tempImagePath)
      },
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
    changeStatus(PageStatus.loading);
    Taro.uploadFile({
      url: 'https://example.weixin.qq.com/upload',
      filePath,
      name: 'image',
    }).then((res) => {
      const data = res.data;
      console.log(data)
      changeStatus(PageStatus.success);
      NavigateToResultPage(filePath);
    }).catch(() => {
      changeStatus(PageStatus.error)
    })
  }

  const NavigateToResultPage = (filePath) => {
    Taro.navigateTo({
      url: `/pages/recognitionResult/index?imageUrl=${filePath}`
    })
  };

  const handleChooseIamge = () => {
    Taro.chooseImage().then((res) => {
      changeStatus(PageStatus.loading);
      const tempFilePaths = res.tempFilePaths;
      handleUploadFile(tempFilePaths[0])
    }).catch(() => {
      changeStatus(PageStatus.error)
    })
  }
  return (

    <View className='index'>
      <CustomPageStatus statusType={status} />
      <Camera
        device-position={devicePosition}
        flash='off'
        style={{ width: '90%', height: '300px', margin: '10px auto', display: 'flex', alignItems: 'center' }}
      />
      <AtButton onClick={handleChangeDevicePosition}>{devicePosition}</AtButton>
      <AtButton type='primary' onClick={handleTakePhoto}>Take Photo</AtButton>
      <AtButton type='secondary' onClick={handleChooseIamge}>Select Photo</AtButton>

    </View>
  )
}

export default Recognition;
