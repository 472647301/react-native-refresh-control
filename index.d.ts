declare module "@byron-react-native/refresh-control" {
  import { ViewProps } from "react-native";

  export interface RefreshControlProps extends ViewProps {
    refreshing: boolean;
    onRefresh: () => Promise<void>;
    onChangeState: (state: number) => void;
  }
  export class RefreshControl extends React.Component<
    Partial<RefreshControlProps>
  > {
    startRefresh: () => void;
    stopRefresh: () => void;
  }

  export class RNByronRefreshControl extends React.Component<
    Partial<RefreshControlProps>
  > {
    setNativeProps: ({ beginstate }: { beginstate: boolean }) => void;
  }
}
