// Debug helper - Add to window for browser console access
export function debugTutorials() {
  console.log('🔍 DEBUG: Checking localStorage...');
  
  const adminTutorials = JSON.parse(localStorage.getItem('adminTutorials') || '[]');
  const publicTutorials = JSON.parse(localStorage.getItem('tutorials') || '[]');
  
  console.log('📋 Admin Tutorials (adminTutorials key):', adminTutorials.length);
  adminTutorials.forEach(t => {
    console.log(`  - ID: ${t.id}, Title: ${t.title}, Status: ${t.status}, Versions: ${t.versions?.length || 0}`);
  });
  
  console.log('📋 Public Tutorials (tutorials key):', publicTutorials.length);
  publicTutorials.forEach(t => {
    console.log(`  - ID: ${t.id}, Title: ${t.title}, Status: ${t.status}, Versions: ${t.versions?.length || 0}`);
  });
  
  console.log('\n🔗 ID Mismatch Check:');
  const adminIds = new Set(adminTutorials.map(t => t.id));
  const publicIds = new Set(publicTutorials.map(t => t.id));
  
  console.log('In admin but NOT in public:', [...adminIds].filter(id => !publicIds.has(id)));
  console.log('In public but NOT in admin:', [...publicIds].filter(id => !adminIds.has(id)));
  console.log('In BOTH:', [...adminIds].filter(id => publicIds.has(id)));
}

// Expose to window for console access
if (typeof window !== 'undefined') {
  window.debugTutorials = debugTutorials;
}
