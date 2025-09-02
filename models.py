from app import db
from datetime import datetime

class Exemplo(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    nome = db.Column(db.String(100), nullable=False)
    situacao = db.Column(db.Text, nullable=False)
    peca_sombra = db.Column(db.String(200), nullable=False)
    resultado = db.Column(db.Text, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    def __repr__(self):
        return f'<Exemplo {self.nome}>'
