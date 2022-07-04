declare module "@byron-react-native/refresh-control" {
  import { ViewProps } from "react-native";

  export class RNRefreshHeader extends React.Component<ViewProps> {}

  export interface RefreshControlProps extends ViewProps {
    refreshing?: boolean;
    onRefresh?: () => Promise<void>;
    onChangeState?: (state: number) => void;
    onChangeOffset?: (offset: number) => void;
  }

  export type RNRefreshControlProps = Omit<RefreshControlProps, "onRefresh"> & {
    height: number;
  };

  export class RNRefreshControl extends React.Component<RNRefreshControlProps> {}

  export class RefreshControl extends React.Component<RefreshControlProps> {
    startRefresh: () => void;
    stopRefresh: () => void;
  }
}
