import { Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { config } from '../config/index.js';
import { AuthRequest, AdminJwtPayload } from '../types/auth.js';

export function authenticateAdmin(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    // 1. Extract token from HttpOnly cookie or Authorization header
    let token = req.cookies?.admin_token;

    if (!token && req.headers.authorization) {
      const parts = req.headers.authorization.split(' ');
      if (parts.length === 2 && parts[0] === 'Bearer') {
        token = parts[1];
      }
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        error: 'Authentication required. Please sign in to access admin resources.'
      });
    }

    // 2. Verify JWT Token
    const decoded = jwt.verify(token, config.jwtSecret) as AdminJwtPayload;

    if (!decoded || (!decoded.id && !(decoded as any).user_id)) {
      return res.status(401).json({
        success: false,
        error: 'Invalid or expired session token.'
      });
    }

    // 3. Verify Admin Role Authorization (Provider/End-User tokens without admin role are forbidden)
    const role = (decoded.role || '').toLowerCase();
    const isAdminRole = role === 'admin' || role === 'super_admin' || role === 'superadmin' || role === 'reviewer';
    if (!isAdminRole) {
      return res.status(403).json({
        success: false,
        error: 'Access denied. Administrative role required to access internal resources.'
      });
    }

    // 4. Attach authenticated admin payload to request
    req.admin = decoded;
    next();
  } catch (err) {
    return res.status(401).json({
      success: false,
      error: 'Invalid or expired authentication session.'
    });
  }
}

/**
 * Optional authentication middleware that attaches admin payload if token exists,
 * but does not block requests if unauthenticated.
 */
export function optionalAuthenticateAdmin(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    let token = req.cookies?.admin_token;

    if (!token && req.headers.authorization) {
      const parts = req.headers.authorization.split(' ');
      if (parts.length === 2 && parts[0] === 'Bearer') {
        token = parts[1];
      }
    }

    if (token) {
      const decoded = jwt.verify(token, config.jwtSecret) as AdminJwtPayload;
      if (decoded && (decoded.id || (decoded as any).user_id)) {
        req.admin = decoded;
      }
    }
  } catch (err) {
    // Silently continue for optional auth
  }
  next();
}

/**
 * Middleware to ensure the requester is either the user themselves (matching :userId) OR an authenticated admin.
 * Rejects cross-user data access (IDOR prevention).
 */
export function authorizeUserOrAdmin(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const targetUserId = req.params.userId || (req.params as any).providerUid;

    let token = req.cookies?.admin_token || req.cookies?.provider_token || req.cookies?.token;

    if (!token && req.headers.authorization) {
      const parts = req.headers.authorization.split(' ');
      if (parts.length === 2 && parts[0] === 'Bearer') {
        token = parts[1];
      }
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        error: 'Authentication required to access user submissions.'
      });
    }

    const decoded = jwt.verify(token, config.jwtSecret) as any;
    if (!decoded) {
      return res.status(401).json({
        success: false,
        error: 'Invalid or expired session token.'
      });
    }

    const requesterRole = (decoded.role || '').toLowerCase();
    const isAdmin = requesterRole === 'admin' || requesterRole === 'super_admin' || requesterRole === 'superadmin' || requesterRole === 'reviewer';
    const requesterUserId = String(decoded.user_id || decoded.id || decoded.userId || '').toLowerCase();
    const cleanTargetId = String(targetUserId || '').toLowerCase();

    // Allow if requester is an admin OR if requester user_id matches target user_id
    if (isAdmin || (requesterUserId && requesterUserId === cleanTargetId)) {
      req.admin = isAdmin ? decoded : undefined;
      (req as any).user = decoded;
      return next();
    }

    return res.status(403).json({
      success: false,
      error: 'Access denied. You are not authorized to view submissions belonging to other users.'
    });
  } catch (err) {
    return res.status(401).json({
      success: false,
      error: 'Invalid or expired authentication session.'
    });
  }
}

/**
 * Middleware to enforce super_admin role requirement
 */
export function requireSuperAdmin(req: AuthRequest, res: Response, next: NextFunction) {
  if (!req.admin) {
    return res.status(401).json({
      success: false,
      error: 'Authentication required.'
    });
  }

  const role = req.admin.role;
  if (role !== 'super_admin' && role !== 'Super Admin') {
    return res.status(403).json({
      success: false,
      error: 'Access denied. Super Admin role is required for this action.'
    });
  }

  next();
}
