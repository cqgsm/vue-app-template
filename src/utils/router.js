/** 
 * 记录浏览记录解决路由方向问题
 * 保持和history api机制一致
 * http://web.jobbole.com/87227/
 */


/**
 * to 如果在这个列表中，始终采用从左到右的滑动效果，首页比较适合用这种方式
 *
 * @type {Array.<string>}
 * @const
 */
const ALWAYS_BACK_PAGE = ['index'];

/**
 * to 如果在这个列表中，始终采用从右到左的滑动效果
 *
 * @type {Array.<string>}
 * @const
 */
const ALWAYS_FORWARD_PAGE = [];

/**
 * 历史记录，记录访问过的页面的 fullPath
 *
 * @type {Array.<string>}
 */
let HISTORY_STACK = [];

/**
 * 用于存储历史记录到localStorage的key
 *
 * @type {String}
 * @const
 */
const APP_HISTORY_ARRAY_STACK_LOCAL_KEY = 'APP_HISTORY_ARRAY_STACK_LOCAL_KEY';


/**
 * 存储记录到localStorage 防止刷新页面丢失记录
 * @param {string} key 
 * @param {object | string} data 
 */
function saveHistoryToLocal(key, data) {
  try {
    localStorage.setItem(key, typeof data === 'object' ? JSON.stringify(data) : data);
  } catch (err) {
    console.log(err);
  }
}

/**
 * 初始化history array
 * @param {string} routerBase 
 */
function initHistoryArrayStack(routerBase) {

  let firstPageFullPath = location.href.replace(location.origin + routerBase, '/');

  try {
    // 如果localStorage中有历史访问记录，且最新一条和当前访问的是同一个页面
    // 那应该把之前的记录也加进来，主要解决在访问过程中刷新导致history列表丢失的问题
    let historyStack = JSON.parse(localStorage.getItem(APP_HISTORY_ARRAY_STACK_LOCAL_KEY));
    if (
      historyStack
      && historyStack.length
      && historyStack[historyStack.length - 1] === firstPageFullPath
    ) {
      HISTORY_STACK = historyStack;
    }
  }
  catch (err) {

  }

  // 首次访问的页面也要加入列表中
  if (HISTORY_STACK.indexOf(firstPageFullPath) === -1) {
    HISTORY_STACK.push(firstPageFullPath);
  }
}


/**
 * 用path记录判断当前是否是前进，true 表示是前进，否则是回退
 *
 * @param {Object} to 目标 route
 * @param {Object} from 源 route
 * @return {boolean} 是否表示返回
 */
function isForwardByArray(to, from) {

  // 根据 fullPath 判断当前页面是否访问过，如果访问过，则属于返回
  let index = HISTORY_STACK.indexOf(to.fullPath);
  if (index !== -1) {
    HISTORY_STACK.length = index + 1;
    return false;
  }

  return true;

}


/**
 * 判断当前是否是前进，true 表示是前进，否则是回退
 *
 * @param {Object} to 目标 route
 * @param {Object} from 源 route
 * @return {boolean} 是否表示返回
 */
function isForward(to, from) {

  let res = isForwardByArray(to, from);

  if (res) {
    // 前进 将 to.fullPath 加到栈顶
    HISTORY_STACK.push(to.fullPath);
  }

  saveHistoryToLocal(APP_HISTORY_ARRAY_STACK_LOCAL_KEY, HISTORY_STACK);

  // 以下属于强行更改方向系列
  // to 如果在这个列表中，始终认为是后退
  // 如果在这个列表中，始终认为是前进
  if (to.name && ALWAYS_BACK_PAGE.indexOf(to.name) !== -1) {
    res = false;
  } else if (to.name && ALWAYS_FORWARD_PAGE.indexOf(to.name) !== -1) {
    res = true;
  }

  return res;
}


export {
  isForward,
  initHistoryArrayStack
}