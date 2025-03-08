import Header from '../../../components/header';
import ResizableV2 from './components/resizable-v2';

export default function Resizable() {
  return (
    <div className="flex flex-col w-full h-screen">
      <Header className="w-full">
        <h1 className="text-lg">Resizable Div</h1>
      </Header>

      <div className="flex-1">
        <div className="w-full flex flex-row overflow-auto">
          <ResizableV2 />
          <ResizableV2 />
          <ResizableV2 />
          <ResizableV2 />
          <ResizableV2 />
          <ResizableV2 />
          <ResizableV2 />
          <ResizableV2 />
          <ResizableV2 />
          <ResizableV2 />
          <ResizableV2 />
          <ResizableV2 />
          <ResizableV2 />
          <ResizableV2 />
          <ResizableV2 />
        </div>
      </div>
    </div>
  );
}
