import CustomPageContainer from '../../components/framework/CustomPageContainer';
import UploadBox from './UploadBox';

export default function DataPostUploadPage() {
  return (
    <CustomPageContainer headerOptions={{ title: 'Upload Data File' }}>
      <UploadBox />
    </CustomPageContainer>
  );
}
