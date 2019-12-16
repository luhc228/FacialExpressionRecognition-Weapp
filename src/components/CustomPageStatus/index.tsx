import Taro from '@tarojs/taro';
import { AtToast } from "taro-ui";
import { PageStatus } from '@/enums/index';

interface PageStatusToast {
  statusType: PageStatus.loading | PageStatus.success | PageStatus.error;
}

const statusModels = {
  [PageStatus.loading]: {
    text: 'Loading...',
    icon: 'loading'
  },
  [PageStatus.success]: {
    text: 'Success',
    icon: 'success'
  },
  [PageStatus.error]: {
    text: 'Error',
    icon: 'error'
  },
}

const PageToast: Taro.FC<PageStatusToast> = ({ statusType }) => {
  const content = statusModels[statusType];

  return (
    <AtToast isOpened status='loading' text={content.text}></AtToast>
  )
}



export default PageToast;
