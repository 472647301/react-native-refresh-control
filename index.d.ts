declare module "@byron-react-native/refresh-control" {
  import { ViewProps } from "react-native";

  export interface RefreshControlProps extends ViewProps {
    refreshing?: boolean;
    onRefresh?: () => Promise<void>;
    onChangeState?: (state: number) => void;
  }
  export class RefreshControl extends React.Component<RefreshControlProps> {
    startRefresh: () => void;
    stopRefresh: () => void;
  }

  export class ByronRefreshControl extends React.Component<RefreshControlProps> {
    setNativeProps: ({ beginstate }: { beginstate: boolean }) => void;
  }
}
