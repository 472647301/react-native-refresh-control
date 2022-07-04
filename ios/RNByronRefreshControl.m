// RNByronRefreshControl.m

#import "RNByronRefreshControl.h"
#import "RCTRefreshableProtocol.h"
#import "RNByronRefreshHeader.h"

@implementation RNByronRefreshControl

RCT_EXPORT_MODULE()

- (UIView *)view {
    return [[RNByronRefreshHeader alloc] init];
}

RCT_EXPORT_VIEW_PROPERTY(refreshing, BOOL)
RCT_EXPORT_VIEW_PROPERTY(height, NSInteger)
RCT_EXPORT_VIEW_PROPERTY(onChangeState, RCTDirectEventBlock)
RCT_EXPORT_VIEW_PROPERTY(onChangeOffset, RCTDirectEventBlock)

@end
