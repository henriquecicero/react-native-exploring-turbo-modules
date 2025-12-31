import React from 'react';
import {
  Alert,
  Button,
  StyleSheet,
  Text,
  View,
  type StyleProp,
  type ViewStyle,
} from 'react-native';

import NativePDFViewNative, {
  type NativeProps as NativePDFViewProps,
} from '../specs/NativePDFView';

export type PDFViewProps = {
  sourceURL?: string;
  pagingEnabled?: boolean;
  style?: StyleProp<ViewStyle>;
};

const DEFAULT_PDF_SOURCE_URL = 'https://www.irs.gov/pub/irs-pdf/fw4.pdf';

function PDFView({
  sourceURL = DEFAULT_PDF_SOURCE_URL,
  pagingEnabled = true,
  style,
}: PDFViewProps): React.JSX.Element {
  const [page, setPage] = React.useState(0);
  const [pageCount, setPageCount] = React.useState(0);

  type LoadEvent = Parameters<NonNullable<NativePDFViewProps['onLoad']>>[0];
  type PageChangedEvent = Parameters<
    NonNullable<NativePDFViewProps['onPageChanged']>
  >[0];
  type ErrorEvent = Parameters<NonNullable<NativePDFViewProps['onError']>>[0];

  const nativeProps: NativePDFViewProps = {
    sourceURL,
    page,
    pagingEnabled,
    onLoad: (event: LoadEvent) => {
      setPageCount(event.nativeEvent.pageCount);
      setPage(event.nativeEvent.page);
    },
    onPageChanged: (event: PageChangedEvent) => {
      setPage(event.nativeEvent.page);
    },
    onError: (event: ErrorEvent) => {
      Alert.alert('PDF Error', event.nativeEvent.message);
    },
  };

  return (
    <View style={[styles.container, style]}>
      <Text>Native PDF</Text>
      <Text style={styles.caption}>
        Page: {page + 1} / {pageCount || '...'}
      </Text>
      <View style={styles.pdfControls}>
        <Button title="Prev" onPress={() => setPage(Math.max(0, page - 1))} />
        <Button
          title="Next"
          onPress={() =>
            setPage(
              pageCount > 0 ? Math.min(pageCount - 1, page + 1) : page + 1,
            )
          }
        />
      </View>
      <NativePDFViewNative style={styles.pdfView} {...nativeProps} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  caption: {
    marginTop: 6,
    marginBottom: 8,
  },
  pdfControls: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  pdfView: {
    width: '100%',
    height: 360,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#222',
    overflow: 'hidden',
  },
});

export default PDFView;
