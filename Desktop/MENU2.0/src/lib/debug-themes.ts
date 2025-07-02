import { supabase } from './supabase'

export async function debugThemes() {
  console.group('🍎 Apple Themes Debug')
  
  try {
    // Test 1: Check database connection
    console.log('1. Testing database connection...')
    const { data: testData, error: testError } = await supabase
      .from('themes')
      .select('count')
      .limit(1)
    
    if (testError) {
      console.error('❌ Database connection failed:', testError)
      return { success: false, error: 'Database connection failed' }
    }
    console.log('✅ Database connection successful')
    
    // Test 2: Check if themes table exists and has data
    console.log('2. Checking themes table...')
    const { data: themes, error: themesError } = await supabase
      .from('themes')
      .select('*')
    
    if (themesError) {
      console.error('❌ Error fetching themes:', themesError)
      return { success: false, error: `Themes table error: ${themesError.message}` }
    }
    
    console.log(`✅ Found ${themes?.length || 0} themes in database`)
    console.table(themes)
    
    // Test 3: Check required columns
    console.log('3. Checking theme structure...')
    if (themes && themes.length > 0) {
      const firstTheme = themes[0]
      const requiredFields = ['theme_name', 'is_active', 'description', 'background_color']
      const missingFields = requiredFields.filter(field => !(field in firstTheme))
      
      if (missingFields.length > 0) {
        console.error('❌ Missing required fields:', missingFields)
        return { success: false, error: `Missing fields: ${missingFields.join(', ')}` }
      }
      console.log('✅ All required fields present')
    }
    
    // Test 4: Check active theme
    console.log('4. Checking active theme...')
    const { data: activeTheme, error: activeError } = await supabase
      .from('themes')
      .select('*')
      .eq('is_active', true)
      .single()
    
    if (activeError && activeError.code !== 'PGRST116') {
      console.error('❌ Error fetching active theme:', activeError)
    } else if (activeTheme) {
      console.log('✅ Active theme found:', activeTheme.theme_name)
    } else {
      console.warn('⚠️ No active theme found')
    }
    
    // Test 5: Test theme switching function
    console.log('5. Testing theme switch function...')
    try {
      const { data: switchResult, error: switchError } = await supabase.rpc('switch_theme', {
        theme_name_param: 'Apple Dark'
      })
      
      if (switchError) {
        console.error('❌ Theme switch function error:', switchError)
        return { success: false, error: `Switch function error: ${switchError.message}` }
      }
      console.log('✅ Theme switch function working:', switchResult)
    } catch (err) {
      console.error('❌ Theme switch function not available:', err)
      return { success: false, error: 'Theme switch function not found - run the SQL setup' }
    }
    
    // Test 6: Check permissions
    console.log('6. Testing permissions...')
    const { data: permTest, error: permError } = await supabase
      .from('available_themes')
      .select('*')
    
    if (permError) {
      console.error('❌ Permission error on available_themes view:', permError)
      return { success: false, error: `Permission error: ${permError.message}` }
    }
    console.log('✅ Permissions working correctly')
    
    console.log('🎉 All theme debug tests passed!')
    return { 
      success: true, 
      message: 'Theme system is working correctly',
      themeCount: themes?.length || 0,
      activeTheme: activeTheme?.theme_name || 'None'
    }
    
  } catch (error) {
    console.error('❌ Debug failed with exception:', error)
    return { success: false, error: `Debug exception: ${error}` }
  } finally {
    console.groupEnd()
  }
}

// Quick theme status check
export async function quickThemeStatus() {
  try {
    const { data, error } = await supabase
      .from('themes')
      .select('theme_name, is_active, created_at')
      .order('is_active', { ascending: false })
    
    if (error) {
      return { error: error.message }
    }
    
    return {
      total: data?.length || 0,
      active: data?.find(t => t.is_active)?.theme_name || 'None',
      themes: data?.map(t => ({
        name: t.theme_name,
        active: t.is_active,
        created: t.created_at
      })) || []
    }
  } catch (err) {
    return { error: `Status check failed: ${err}` }
  }
} 