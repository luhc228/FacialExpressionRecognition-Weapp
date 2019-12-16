import Taro from '@tarojs/taro';
import { AtToast } from "taro-ui";
import { PageStatus } from '@/enums/index';

interface PageStatusToast {
  statusType: PageStatus.loading | PageStatus.success | PageStatus.error;
  isOpened: boolean;
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

const PageToast: Taro.FC<PageStatusToast> = ({ statusType, isOpened }) => {
  const content = statusModels[statusType];
  return (
    <AtToast isOpened={isOpened} status={statusType} text={content.text}></AtToast>
  )
}



export default PageToast;
