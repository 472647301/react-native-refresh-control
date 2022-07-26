#import "RNByronRefreshHeader.h"
#import <React/RCTRefreshableProtocol.h>
#import "RCTUtils.h"

@interface RNByronRefreshHeader () <RCTRefreshableProtocol> {
    float offset;
}
@end

@implementation RNByronRefreshHeader

- (instancetype)init {
    self = [super init];
    return self;
}

RCT_NOT_IMPLEMENTED(-(instancetype)initWithCoder : (NSCoder *)aDecoder)

- (void)setRefreshing:(BOOL)refreshing {
    if (refreshing) {
        [self beginRefreshing];
    } else {
        [self endRefreshing];
    }
}

- (void)setHeight:(NSInteger *)height {
    self.mj_h = (long) height;
}

#pragma mark - 重写方法
#pragma mark 在这里做一些初始化配置（比如添加子控件）
- (void)prepare {
    [super prepare];
}

#pragma mark 在这里设置子控件的位置和尺寸
- (void)placeSubviews {
    [super placeSubviews];
}

#pragma mark 监听scrollView的contentOffset改变
- (void)scrollViewContentOffsetDidChange:(NSDictionary *)change {
    [super scrollViewContentOffsetDidChange:change];
    if (change && [change.allKeys containsObject:@"new"]) {
        CGPoint point = [[change objectForKey:@"new"] CGPointValue];
        if(_onChangeOffset) {
            if (point.y > 0) {
                // 与android保持一致 避免为0之后多次通知
                if (offset != 0) {
                    offset = 0;
                    _onChangeOffset(@{@"offset": @(offset)});
                }
            } else {
                // 取绝对值， 与android保持一致
                offset = fabs(point.y);
                _onChangeOffset(@{@"offset": @(offset)});
            }
        }
    }
}

#pragma mark 监听scrollView的contentSize改变
- (void)scrollViewContentSizeDidChange:(NSDictionary *)change {
    [super scrollViewContentSizeDidChange:change];
}

#pragma mark 监听scrollView的拖拽状态改变
- (void)scrollViewPanStateDidChange:(NSDictionary *)change {
    [super scrollViewPanStateDidChange:change];
    
}

#pragma mark 监听控件的刷新状态
- (void)setState:(MJRefreshState)state {
    MJRefreshCheckState;
    if (_onChangeState) {
        _onChangeState(@{@"state": @(state)});
    }
}

#pragma mark 监听拖拽比例（控件被拖出来的比例）
- (void)setPullingPercent:(CGFloat)pullingPercent {
    [super setPullingPercent:pullingPercent];
    // 这里获取的offset不准确，而且下滑在上滑会导致值不更新
}

@synthesize refreshing;

@synthesize onRefresh;

@end
