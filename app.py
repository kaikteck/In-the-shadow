import os
import logging
from flask import Flask, render_template, request, redirect, url_for, flash, session
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy.orm import DeclarativeBase
from werkzeug.middleware.proxy_fix import ProxyFix

# Setup logging
logging.basicConfig(level=logging.DEBUG)

class Base(DeclarativeBase):
    pass

db = SQLAlchemy(model_class=Base)

# create the app
app = Flask(__name__)
app.secret_key = os.environ.get("SESSION_SECRET", "fallback_secret_key_for_development")
app.wsgi_app = ProxyFix(app.wsgi_app, x_proto=1, x_host=1)

# configure the database
app.config["SQLALCHEMY_DATABASE_URI"] = os.environ.get("DATABASE_URL", "sqlite:///shadows.db")
app.config["SQLALCHEMY_ENGINE_OPTIONS"] = {
    "pool_recycle": 300,
    "pool_pre_ping": True,
}

# initialize the app with the extension
db.init_app(app)

with app.app_context():
    import models
    db.create_all()

@app.route('/')
def inicio():
    return render_template('inicio.html')

@app.route('/teoria', methods=['GET', 'POST'])
def teoria():
    if request.method == 'POST':
        teoria_content = request.form.get('teoria_content', '')
        session['teoria_content'] = teoria_content
        flash('Teoria salva com sucesso!', 'success')
        return redirect(url_for('teoria'))
    
    teoria_content = session.get('teoria_content', '')
    return render_template('teoria.html', teoria_content=teoria_content)

@app.route('/exemplos', methods=['GET', 'POST'])
def exemplos():
    if request.method == 'POST':
        nome = request.form.get('nome')
        situacao = request.form.get('situacao')
        peca_sombra = request.form.get('peca_sombra')
        resultado = request.form.get('resultado')
        
        if nome and situacao and peca_sombra and resultado:
            exemplo = models.Exemplo(
                nome=nome,
                situacao=situacao,
                peca_sombra=peca_sombra,
                resultado=resultado
            )
            db.session.add(exemplo)
            db.session.commit()
            flash('Exemplo adicionado com sucesso!', 'success')
        else:
            flash('Por favor, preencha todos os campos.', 'error')
        
        return redirect(url_for('exemplos'))
    
    exemplos = models.Exemplo.query.all()
    return render_template('exemplos.html', exemplos=exemplos)

@app.route('/conceitos')
def conceitos():
    return render_template('conceitos.html')

@app.route('/delete_exemplo/<int:id>')
def delete_exemplo(id):
    exemplo = models.Exemplo.query.get_or_404(id)
    db.session.delete(exemplo)
    db.session.commit()
    flash('Exemplo removido com sucesso!', 'success')
    return redirect(url_for('exemplos'))

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
