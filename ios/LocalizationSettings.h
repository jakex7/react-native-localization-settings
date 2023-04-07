
#ifdef RCT_NEW_ARCH_ENABLED
#import "RNLocalizationSettingsSpec.h"

@interface LocalizationSettings : NSObject <NativeLocalizationSettingsSpec>
#else
#import <React/RCTBridgeModule.h>

@interface LocalizationSettings : NSObject <RCTBridgeModule>
#endif

@end
