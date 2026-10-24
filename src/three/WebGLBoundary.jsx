import { Component } from 'react';

/**
 * Catches WebGL / three.js runtime failures (unsupported GPU, context loss,
 * failed model load) so a broken 3D layer never takes down the page.
 * Renders `fallback` (default: nothing) instead.
 */
export default class WebGLBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error) {
    if (import.meta.env.DEV) {
      console.warn('[WebGLBoundary] 3D scene disabled:', error);
    }
  }

  render() {
    if (this.state.hasError) return this.props.fallback ?? null;
    return this.props.children;
  }
}
