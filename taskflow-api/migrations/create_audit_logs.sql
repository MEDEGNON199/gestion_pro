-- Migration: Création de la table audit_logs
-- Description: Table pour logger toutes les actions des utilisateurs

CREATE TABLE IF NOT EXISTS audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  utilisateur_id UUID NOT NULL REFERENCES utilisateurs(id) ON DELETE CASCADE,
  action VARCHAR(255) NOT NULL,
  ressource_type VARCHAR(100),
  ressource_id VARCHAR(255),
  details JSONB,
  ip_address VARCHAR(45),
  user_agent TEXT,
  status VARCHAR(20) DEFAULT 'success',
  date_action TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Index pour améliorer les performances des requêtes
CREATE INDEX IF NOT EXISTS idx_audit_logs_utilisateur ON audit_logs(utilisateur_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_action ON audit_logs(action);
CREATE INDEX IF NOT EXISTS idx_audit_logs_date ON audit_logs(date_action DESC);
CREATE INDEX IF NOT EXISTS idx_audit_logs_ressource ON audit_logs(ressource_type, ressource_id);

-- Commentaires
COMMENT ON TABLE audit_logs IS 'Table de logs d''audit pour tracer toutes les actions des utilisateurs';
COMMENT ON COLUMN audit_logs.action IS 'Type d''action effectuée (LOGIN, LOGOUT, CREATE_PROJECT, etc.)';
COMMENT ON COLUMN audit_logs.ressource_type IS 'Type de ressource affectée (projet, tache, utilisateur, etc.)';
COMMENT ON COLUMN audit_logs.ressource_id IS 'ID de la ressource affectée';
COMMENT ON COLUMN audit_logs.details IS 'Détails supplémentaires de l''action en JSON';
COMMENT ON COLUMN audit_logs.status IS 'Statut de l''action (success, failed)';
