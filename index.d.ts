declare module "@byron-react-native/refresh-control" {
  import { View } from "react-native";

  export class RNRefreshHeader extends View {}

  export class RNRefreshControl extends View {
    refreshing?: boolean;
    onChangeState?: (state: number) => void;
  }

  export class RefreshControl extends View {
    refreshing?: boolean;
    startRefresh: () => void;
    stopRefresh: () => void;
  }
}
