"""Agregando tabla para lista de deseos

Revision ID: b0e1e886a1cc
Revises: ffd098b607ae
Create Date: 2024-03-26 14:37:54.340118

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'b0e1e886a1cc'
down_revision = 'ffd098b607ae'
branch_labels = None
depends_on = None


def upgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table('whish_list',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('json_list', sa.String(), nullable=False),
    sa.Column('url_list', sa.String(), nullable=True),
    sa.Column('id_list', sa.String(), nullable=False),
    sa.Column('created_at', sa.DateTime(), nullable=False),
    sa.Column('updated_at', sa.DateTime(), nullable=False),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_whish_list_id'), 'whish_list', ['id'], unique=False)
    # ### end Alembic commands ###


def downgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_index(op.f('ix_whish_list_id'), table_name='whish_list')
    op.drop_table('whish_list')
    # ### end Alembic commands ###
