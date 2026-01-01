import type { CodegenTypes, HostComponent, ViewProps } from 'react-native';
import { codegenNativeComponent } from 'react-native';

type NativePDFViewLoadEvent = {
  pageCount: CodegenTypes.Int32;
  page: CodegenTypes.Int32;
};

type NativePDFViewPageChangedEvent = {
  page: CodegenTypes.Int32;
};

type NativePDFViewErrorEvent = {
  message: string;
  code?: string;
};

export interface NativeProps extends ViewProps {
  sourceURL?: string;
  page?: CodegenTypes.Int32;
  scale?: CodegenTypes.Double;
  pagingEnabled?: boolean;
  onLoad?: CodegenTypes.BubblingEventHandler<NativePDFViewLoadEvent> | null;
  onPageChanged?: CodegenTypes.BubblingEventHandler<NativePDFViewPageChangedEvent> | null;
  onError?: CodegenTypes.BubblingEventHandler<NativePDFViewErrorEvent> | null;
}

export default codegenNativeComponent<NativeProps>(
  'NativePDFView',
) as HostComponent<NativeProps>;
