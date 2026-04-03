/**
 * saleDate 一括修正スクリプト
 *
 * 対象：saleDate が空で、saleShop の先頭に「MM-DD_」形式の日付が含まれるエントリ
 * 処理：MM-DD を抽出して saleDate に 2026-MM-DD として入力し、saleShop から日付部分を削除
 *
 * 使い方：
 *   1. Chrome でダッシュボード（dashboard.html）を開く
 *   2. F12 → Console タブ
 *   3. このファイルの内容を全選択してコピー → コンソールに貼り付けて Enter
 */

(function(){
  var ACCOUNTS = ['01','03','04','05','06','07','08','09','10','11','12','13',
                  '14','15','16','17','18','19','20','21','22','23','24','25','26','27','28'];
  var YEAR     = '2026';
  var pattern  = /^(\d{2})-(\d{2})_(.*)$/;  // MM-DD_店名

  var totalFixed = 0;
  var log = [];

  ACCOUNTS.forEach(function(acc){
    var key = 'account_' + acc;
    var entries;
    try { entries = JSON.parse(localStorage.getItem(key) || '[]'); }
    catch(e){ console.warn('parse error: ' + key); return; }

    var fixed = 0;
    entries.forEach(function(e){
      // saleDate が空 かつ saleShop が MM-DD_ で始まる
      if(!e.saleDate && e.saleShop){
        var m = e.saleShop.match(pattern);
        if(m){
          e.saleDate = YEAR + '-' + m[1] + '-' + m[2];  // 例: 2026-02-11
          e.saleShop = m[3].trim();                       // 日付部分を除いた店名
          fixed++;
        }
      }
    });

    if(fixed > 0){
      localStorage.setItem(key, JSON.stringify(entries));
      log.push('  アカウント ' + acc + ': ' + fixed + ' 件修正');
      totalFixed += fixed;
    }
  });

  if(totalFixed === 0){
    console.log('対象データが見つかりませんでした（既に修正済みか、該当パターンなし）');
  } else {
    console.log('=== 修正完了 ===');
    log.forEach(function(l){ console.log(l); });
    console.log('合計 ' + totalFixed + ' 件を修正しました。');
    console.log('');
    console.log('→ ページを再読み込み（F5）してダッシュボードを更新してください。');
  }
})();
