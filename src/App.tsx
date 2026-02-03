import { File } from './components/icons';
// 빌드 트리거
function App() {
  return (
    <div className="container-custom py-12">
      <h1 className="heading-xlarge text-primary-600">제목</h1>
      <p className="body-large text-gray-700">본문</p>
      <File width={40} height={40} />

      <File className="text-blue-500" />
    </div>
  );
}

export default App;
