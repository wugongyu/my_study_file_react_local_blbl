// 首页容器组件，利用connect包裹UI组件，传递store中的数据
import { connect } from 'react-redux';
import Home from '../views/home';

const mapStateToProps = (state) => ({
  data: state.data,
});

export default connect(mapStateToProps)(Home);