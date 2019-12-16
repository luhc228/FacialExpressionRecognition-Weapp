import Taro, { useRouter } from '@tarojs/taro';
import { View, Image } from '@tarojs/components';

const RecognitionResult: React.FC<{}> = () => {
  const router = useRouter();
  const { params: { imageUrl } } = router;
  return (
    <View className='index'>
      <Image
        style={{
          width: '90%',
          height: '250px',
          margin: '10px auto',
          display: 'flex',
          alignItems: 'center'
        }}
        src={imageUrl}
      />
    </View>
  )
}

export default RecognitionResult;
