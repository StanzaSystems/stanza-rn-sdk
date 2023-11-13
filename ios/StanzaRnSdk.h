
#ifdef RCT_NEW_ARCH_ENABLED
#import "RNStanzaRnSdkSpec.h"

@interface StanzaRnSdk : NSObject <NativeStanzaRnSdkSpec>
#else
#import <React/RCTBridgeModule.h>

@interface StanzaRnSdk : NSObject <RCTBridgeModule>
#endif

@end
