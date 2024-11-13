#import "LocalizationSettings.h"

@implementation LocalizationSettings
RCT_EXPORT_MODULE()


/**
 * Get IETF BCP 47 (language-COUNTRY "pl-PL")
 * if country is not available in locale, then use system defaults (even if it's not 100% correct, like "pl-US")
 **/
-(NSString*) getLanguageTag:(NSString *)language {
    NSLocale *locale = [[NSLocale alloc] initWithLocaleIdentifier:language];
    if ([locale countryCode]) {
        return [locale localeIdentifier];
    }
    NSLocale *currentLocale = [NSLocale currentLocale];
    return [[locale languageCode] stringByAppendingFormat:@"-%@", [currentLocale countryCode]];
}

/**
 * Get current language
 * returns string in IETF BCP 47 (language-COUNTRY "pl-PL")
 **/
- (NSString *)getCurrentLanguage {
    return [self getLanguageTag:[[[NSBundle mainBundle] preferredLocalizations] objectAtIndex:0]];
}

/**
 * Set current language
 * passed language can be in ISO 639-1 (language "pl")
 * or IETF BCP 47 (language-COUNTRY "pl-PL")
 **/
- (void)setCurrentLanguage:(NSString *)lang {
    NSString *languageTag = [self getLanguageTag:lang];
    [[NSUserDefaults standardUserDefaults] setObject:@[languageTag] forKey:@"AppleLanguages"];
    [[NSUserDefaults standardUserDefaults] synchronize];
}


- (void)getLanguage:(RCTPromiseResolveBlock)resolve reject:(RCTPromiseRejectBlock)reject {
    resolve([self getCurrentLanguage]);
}


- (void)setLanguage:(NSString *)lang {
    [self setCurrentLanguage:lang];
}

/**
 * Expose functions to react-native
 **/
RCT_REMAP_METHOD(getLanguage,
                 withResolver:(RCTPromiseResolveBlock)resolve
                 withReject:(RCTPromiseRejectBlock)reject)
{
    return [self getLanguage:resolve reject:reject];
}

RCT_REMAP_METHOD(setLanguage,
                 language:(NSString *)lang)
{
    return [self setLanguage:lang];
}

/**
 * Expose constants to react-native
 **/
- (NSDictionary *)constantsToExport
{
    return @{ @"language": [self getCurrentLanguage]};
}

+(BOOL)requiresMainQueueSetup
{
    return YES;
}

// Don't compile this code when we build for the old architecture.
#ifdef RCT_NEW_ARCH_ENABLED
- (std::shared_ptr<facebook::react::TurboModule>)getTurboModule:
    (const facebook::react::ObjCTurboModule::InitParams &)params
{
    return std::make_shared<facebook::react::NativeLocalizationSettingsSpecJSI>(params);
}

- (facebook::react::ModuleConstants<JS::NativeLocalizationSettings::Constants::Builder>)getConstants {
  return [self constantsToExport];
}

#endif

@end
