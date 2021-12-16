declare module "@byron-react-native/refresh-control" {
  import { ViewProps, FlatList } from "react-native";

  export interface RefreshControlProps extends ViewProps {
    refreshing?: boolean;
    onRefresh?: () => Promise<void>;
    onChangeState?: (state: number) => void;
  }
  export class RefreshControl extends React.Component<RefreshControlProps> {
    startRefresh: () => void;
    stopRefresh: () => void;
  }

  export type ByronRefreshControlProps = Omit<RefreshControlProps, "onRefresh">;

  export class ByronRefreshControl extends React.Component<ByronRefreshControlProps> {
    setNativeProps: ({ beginstate }: { beginstate: boolean }) => void;
  }

  export class RefreshFlatList<T> extends FlatList<T> {
    startRefresh: () => void;
    stopRefresh: () => void;
  }
}
