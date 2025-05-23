"""campo num_in_order agregado a la tabla ordenes

Revision ID: bef84c320696
Revises: 56068498993f
Create Date: 2024-08-02 03:54:09.508688

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'bef84c320696'
down_revision = '56068498993f'
branch_labels = None
depends_on = None


def upgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.add_column('product_order', sa.Column('num_in_order', sa.Integer(), nullable=False))
    # ### end Alembic commands ###


def downgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_column('product_order', 'num_in_order')
    # ### end Alembic commands ###
